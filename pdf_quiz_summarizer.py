import pdfplumber
import random
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer


# ---------------- PDF LOADING ----------------
def load_pdf():
    pdf_path = input("📂 Enter the path of the PDF file: ").strip()
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        print("✅ PDF loaded successfully!")
        return text
    except Exception as e:
        print("❌ Error loading PDF:", e)
        return None


# ---------------- SUMMARIZATION ----------------
def summarize_text(text, sentences_count=5):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentences_count)
    print("\n📌 Summary of the document:\n")
    for sentence in summary:
        print("-", sentence)


# ---------------- QUIZ GENERATION ----------------
def generate_quiz(text, difficulty=1, num_questions=5):
    sentences = [s for s in text.split(".") if len(s.split()) > 5]
    if len(sentences) < num_questions:
        num_questions = len(sentences)

    questions = random.sample(sentences, num_questions)
    quiz = []

    for q in questions:
        correct_answer = q.strip().split()[0]  # crude placeholder answer
        quiz.append({
            "question": f"Q: {q.strip()}?",
            "answer": correct_answer,
        })
    return quiz


def ask_quiz(quiz):
    score = 0
    print("\n📝 Starting Quiz...\n")
    for i, q in enumerate(quiz, 1):
        print(f"{i}. {q['question']}")
        user_answer = input("Your Answer: ").strip()

        if user_answer.lower() == q['answer'].lower():
            print("✅ Correct!\n")
            score += 2  # each question worth 2 points
        else:
            print(f"❌ Wrong. Correct Answer: {q['answer']}\n")

    print(f"🏆 Final Score: {score}/10")

    if score <= 4:
        print("⚠️ Focus Area: Revise basics more carefully.")
    elif score <= 7:
        print("💡 Focus Area: You’re good, but need practice on tougher parts.")
    else:
        print("🔥 Excellent! You have strong knowledge of this material.")


# ---------------- MAIN APP ----------------
def main():
    pdf_text = load_pdf()
    if not pdf_text:
        return

    print("\nWhat would you like to do?")
    print("1. Generate Quiz")
    print("2. Summarize PDF")

    choice = input("Enter choice (1/2): ").strip()

    if choice == "1":
        difficulty = int(input("Choose difficulty (1=Easy, 2=Medium, 3=Hard): ").strip())
        quiz = generate_quiz(pdf_text, difficulty)
        ask_quiz(quiz)

    elif choice == "2":
        summarize_text(pdf_text, sentences_count=5)

    else:
        print("❌ Invalid choice.")


if __name__ == "__main__":
    main()
