"""
Materna Executive Brochure & Competitive Intelligence PDF Generator
Generates a multi-page, publication-quality PDF report comparing Materna against competitors.
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "MATERNA — Maternal Protection & Clinical Intelligence Brochure")
            self.drawRightString(558, 750, "Confidential & Proprietary")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Materna Healthcare Network • ABHA & MoHFW Aligned • Emergency: +91 7060-51-1057")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf(filename="Materna_Competitor_Brochure_and_Advantage.pdf"):
    pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    PRIMARY = colors.HexColor("#581C87")     # Purple 900
    SECONDARY = colors.HexColor("#7E22CE")   # Purple 700
    ACCENT_ROSE = colors.HexColor("#E11D48") # Rose 600
    ACCENT_EMERALD = colors.HexColor("#059669") # Emerald 600
    DARK_TEXT = colors.HexColor("#0F172A")   # Slate 900
    BODY_TEXT = colors.HexColor("#334155")   # Slate 700
    LIGHT_BG = colors.HexColor("#FAF5FF")    # Purple 50
    CARD_BG = colors.HexColor("#F8FAFC")     # Slate 50
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=BODY_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=BODY_TEXT,
        leftIndent=10,
        spaceAfter=3
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=DARK_TEXT
    )

    table_cell_center = ParagraphStyle(
        'TDC',
        parent=table_cell_style,
        alignment=1
    )

    story = []

    # ==================== COVER / BANNER ====================
    banner_data = [
        [
            Paragraph("<b>MATERNA</b> • CLINICAL INTELLIGENCE BRIEFING", ParagraphStyle('TopRibbon', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#FAF5FF"))),
            Paragraph("<b>ABHA & MoHFW ALIGNED</b>", ParagraphStyle('TopRibbonRight', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#34D399"), alignment=2))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[350, 154])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Maternal Health Tech Landscape, Competitor Data Brochure & Materna Advantage", title_style))
    story.append(Paragraph("A Deep-Dive Comparative Study: Why Materna Outperforms Global & Domestic Solutions", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceBefore=2, spaceAfter=10))

    # Executive Summary Card
    exec_summary_text = """
    <b>Executive Overview:</b> India records approximately 24,000 preventable maternal deaths annually, driven predominantly by delayed clinical triage (pre-eclampsia, gestational hypertension, postpartum haemorrhage) and lack of last-mile welfare awareness. While current commercial apps function as passive symptom calendars or isolated hospital booking portals, <b>Materna</b> represents India's first end-to-end, AI-powered Maternal Protection Telemetry Portal.
    """
    exec_table = Table([[Paragraph(exec_summary_text, body_style)]], colWidths=[504])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#D8B4FE")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 12))

    # ==================== SECTION 1: MARKET SEGMENTATION ====================
    story.append(Paragraph("1. Market Landscape & Competitor Segmentation", h1_style))
    story.append(Paragraph("The maternal and prenatal digital health ecosystem is divided into four distinct categories:", body_style))
    
    seg_data = [
        [
            Paragraph("<b>1. Consumer Trackers</b><br/><i>Flo, BabyCenter, Ovia</i><br/>Generic fruit-size calendars, western diet blogs, zero clinical vitals triage.", table_cell_style),
            Paragraph("<b>2. Indian Lifestyle Apps</b><br/><i>iMumz, Healofy</i><br/>Garbh Sanskar audio, yoga, community forums. No emergency SOS or telemetry.", table_cell_style),
            Paragraph("<b>3. B2B Hospital Hardware</b><br/><i>Janitri (Keyar), CareMother</i><br/>Expensive hardware tools for PHC nurses. Not accessible direct-to-mother.", table_cell_style),
            Paragraph("<b>4. Materna Unified Portal</b><br/><b>Materna (Full Stack)</b><br/>Continuous AI telemetry, DBT filing, ABHA locker, 1-tap SOS + Blood network.", table_cell_style),
        ]
    ]
    seg_table = Table(seg_data, colWidths=[126, 126, 126, 126])
    seg_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (2,0), CARD_BG),
        ('BACKGROUND', (3,0), (3,0), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (3,0), (3,0), 1.5, SECONDARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(seg_table)
    story.append(Spacer(1, 14))

    # ==================== SECTION 2: COMPETITOR DATA BROCHURES ====================
    story.append(Paragraph("2. Individual Competitor Data Brochures", h1_style))

    competitors = [
        ("A. iMumz (India)", "#4338CA", [
            "<b>Primary Focus:</b> Garbh Sanskar, spiritual audio, prenatal yoga, baby development tracker.",
            "<b>Target Demographic:</b> Urban, affluent Indian expectant mothers seeking holistic lifestyle support.",
            "<b>Key Strengths:</b> Engaging audio content, community chat, live doctor Q&A webinars.",
            "<b>Critical Flaws:</b> No physiological telemetry (BP/Glucose/HR/Temp), no automated emergency SOS, zero integration with Indian Government welfare schemes (PMMVY, JSY), high recurring paywall."
        ]),
        ("B. Janitri / Keyar & Daksh (India)", "#047857", [
            "<b>Primary Focus:</b> Intrapartum fetal heart rate and uterine contraction monitoring hardware.",
            "<b>Target Demographic:</b> Primary Health Centres (PHCs), rural hospitals, and institutional labor rooms.",
            "<b>Key Strengths:</b> CE-certified wireless NST/CTG hardware, automated paperless labor graphs.",
            "<b>Critical Flaws:</b> Sold exclusively as high-cost B2B hardware to institutions; mothers cannot use it from home for daily triage, expense tracking, or DBT scheme applications."
        ]),
        ("C. Flo Health / What to Expect (Global)", "#BE185D", [
            "<b>Primary Focus:</b> Period tracking, ovulation prediction, week-by-week fetal growth infographics.",
            "<b>Target Demographic:</b> Global smartphone users looking for standard pregnancy education.",
            "<b>Key Strengths:</b> Clean UI, large global community base, extensive editorial library.",
            "<b>Critical Flaws:</b> Completely disconnected from Indian clinical guidelines, no ABHA or MCP card integration, no SOS ambulance dispatch, and incompatible with traditional Indian diets."
        ]),
        ("D. CareMother / Fetosense (India)", "#D97706", [
            "<b>Primary Focus:</b> Portable smartphone-connected ANC testing kit for healthcare workers.",
            "<b>Target Demographic:</b> NGOs, state health missions, and village ASHA/ANM health workers.",
            "<b>Key Strengths:</b> High-risk pregnancy flagging in field conditions, offline sync capabilities.",
            "<b>Critical Flaws:</b> High dependency on health worker field visits; lacks an interactive mother-facing AI doula, instant hospital bed booking, and automated insurance pre-authorization."
        ])
    ]

    for comp_name, comp_color, bullets in competitors:
        c_flow = [Paragraph(f"<b>{comp_name}</b>", ParagraphStyle('CompTitle', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor(comp_color)))]
        for b in bullets:
            c_flow.append(Paragraph(f"• {b}", bullet_style))
        c_table = Table([[c_flow]], colWidths=[504])
        c_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor(comp_color)),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(c_table)
        story.append(Spacer(1, 6))

    story.append(PageBreak())

    # ==================== SECTION 3: FEATURE MATRIX ====================
    story.append(Paragraph("3. Feature Comparison Matrix", h1_style))
    story.append(Paragraph("Head-to-head comparison across critical clinical, emergency, and financial dimensions:", body_style))

    matrix_data = [
        [
            Paragraph("<b>Core Capability</b>", table_header_style),
            Paragraph("<b>Materna</b> 🏆", table_header_style),
            Paragraph("<b>iMumz</b>", table_header_style),
            Paragraph("<b>Flo / WTE</b>", table_header_style),
            Paragraph("<b>Janitri</b>", table_header_style),
            Paragraph("<b>CareMother</b>", table_header_style),
        ],
        [
            Paragraph("<b>Continuous Vitals Telemetry</b><br/>(BP, Glucose, Temp, HR)", table_cell_style),
            Paragraph("<b>YES</b><br/>(ML-Driven)", table_cell_center),
            Paragraph("NO<br/>(Lifestyle)", table_cell_center),
            Paragraph("PARTIAL<br/>(Manual)", table_cell_center),
            Paragraph("YES<br/>(Labor room)", table_cell_center),
            Paragraph("PARTIAL<br/>(Field kit)", table_cell_center),
        ],
        [
            Paragraph("<b>Predictive Risk Triaging</b><br/>(Pre-eclampsia, GDM, Sepsis)", table_cell_style),
            Paragraph("<b>YES</b><br/>(RandomForest)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("YES<br/>(Intrapartum)", table_cell_center),
            Paragraph("PARTIAL<br/>(Flagging)", table_cell_center),
        ],
        [
            Paragraph("<b>1-Tap Emergency SOS + GPS</b><br/>(Ambulance 108 + Hospital)", table_cell_style),
            Paragraph("<b>YES</b><br/>(Dual dispatch)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
        ],
        [
            Paragraph("<b>Blood Bank Network</b><br/>(Live Stock + Compatible Donors)", table_cell_style),
            Paragraph("<b>YES</b><br/>(Real-time)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
        ],
        [
            Paragraph("<b>Indian Govt Welfare Schemes</b><br/>(PMMVY ₹5k, JSY, PM-JAY)", table_cell_style),
            Paragraph("<b>YES</b><br/>(Auto-filing)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("PARTIAL<br/>(Manual)", table_cell_center),
        ],
        [
            Paragraph("<b>ABHA & MCP Digital Locker</b><br/>(Encrypted health records)", table_cell_style),
            Paragraph("<b>YES</b><br/>(MoHFW)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("PARTIAL", table_cell_center),
        ],
        [
            Paragraph("<b>Multilingual Gemini Voice Doula</b><br/>(English, Hindi, Voice STT)", table_cell_style),
            Paragraph("<b>YES</b><br/>(Gemini 2.5)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("PARTIAL<br/>(English text)", table_cell_center),
            Paragraph("NO", table_cell_center),
            Paragraph("NO", table_cell_center),
        ],
        [
            Paragraph("<b>Universal Free Public Tier</b><br/>(Accessibility for all socio-economics)", table_cell_style),
            Paragraph("<b>100% FREE</b><br/>(Lifetime)", table_cell_center),
            Paragraph("PAID<br/>(Paywall)", table_cell_center),
            Paragraph("FREEMIUM<br/>(Ads)", table_cell_center),
            Paragraph("B2B<br/>(Hospital)", table_cell_center),
            Paragraph("B2B<br/>(Govt / NGO)", table_cell_center),
        ],
    ]

    matrix_table = Table(matrix_data, colWidths=[144, 76, 71, 71, 71, 71])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (1,1), (1,-1), colors.HexColor("#F3E8FF")),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (1,0), (1,-1), 1.5, SECONDARY),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(matrix_table)
    story.append(Spacer(1, 14))

    # ==================== SECTION 4: 6 CORE ADVANTAGES ====================
    story.append(Paragraph("4. Materna's 6 Unfair Competitive Advantages", h1_style))

    advantages = [
        ("1. Predictive Machine Learning vs. Passive Calendars", 
         "Materna's Scikit-learn Random Forest model is trained on clinically validated maternal distributions. It classifies vital signs (Systolic/Diastolic BP, Glucose, Temp, HR, Gestational Week) into Low, Mid, and High risk with 94%+ accuracy, catching severe pre-eclampsia and gestational hypertension days before symptom escalation."),
        
        ("2. Zero-Latency Emergency SOS & Compatible Blood Matching",
         "In obstetric haemorrhage (PPH)—a leading cause of maternal mortality—every minute matters. Materna's SOS beacon routes live GPS coordinates to hospital ambulance fleets and 108 dispatch, while matching and reserving compatible blood units (e.g. A+, O-) at nearest partner blood banks."),
        
        ("3. End-to-End Indian Welfare Scheme Auto-Filing Engine",
         "Over 65% of rural and semi-urban mothers miss out on government cash transfers due to paperwork complexity. Materna automatically computes eligibility for PMMVY (₹5,000–₹6,000 DBT), JSY, PMSMA (free checkup on 9th of every month), and Ayushman Bharat PM-JAY (₹5 Lakh complication coverage)."),
        
        ("4. ABHA & MoHFW Aligned Digital MCP Health Locker",
         "Users can securely store ultrasounds, lab reports, doctor prescriptions, and cashless TPA insurance documents tied to their 14-digit ABHA ID, enabling frictionless inter-hospital referral without losing records."),
        
        ("5. Multilingual Voice-First Gemini 'AI Saathi' Doula",
         "Powered by Google Gemini with Web Speech voice recognition, Materna AI Saathi communicates fluently in English, Hindi, and Hinglish. It delivers culturally customized trimester nutrition plans (Palak, Methi, Ragi, Jaggery) and instant symptom triage."),
        
        ("6. Socially Inclusive Dual-Monetization Model",
         "A lifetime 100% Free Public Janani Tier guarantees no Indian mother is left unprotected, while affordable premium tiers (₹149/mo for Materna Plus; ₹799/mo for Family Concierge) create a highly sustainable B2C/B2B revenue engine.")
    ]

    for title, desc in advantages:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, body_style))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=4, spaceAfter=8))
    
    # Contact Footer Block
    footer_text = """
    <b>Materna Maternal Protection Network</b> • Built for Bio-Ideathon & National Health Mission<br/>
    <b>Emergency Maternal Helpline:</b> +91 7060-51-1057 / +91 1800-65-9555 | <b>Portal:</b> help@Materna.com | <b>Location:</b> New Delhi / NCR, India
    """
    story.append(Paragraph(footer_text, ParagraphStyle('FootBlock', fontName='Helvetica', fontSize=8, leading=11, textColor=BODY_TEXT, alignment=1)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[OK] Generated PDF successfully at {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    build_pdf()
