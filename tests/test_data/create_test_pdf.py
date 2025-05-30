from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_test_pdf():
    c = canvas.Canvas("tests/test_data/dummy.pdf", pagesize=letter)
    c.drawString(100, 750, "Hello Test PDF!")
    c.save()

if __name__ == "__main__":
    create_test_pdf() 