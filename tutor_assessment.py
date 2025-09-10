from transformers import DistilBertTokenizer, DistilBertModel
import torch
import numpy as np

# Load DistilBERT tokenizer and model
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertModel.from_pretrained('distilbert-base-uncased')

def get_embedding(text):
    """Convert text to 768-dimensional embedding using DistilBERT"""
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :]  # [CLS] token embedding

# --- Personality Questions (open-ended, long-form expected) ---
personality_questions = [
    "When teaching, how do you explain a difficult concept so that students can understand it clearly?",
    "Describe a time when you motivated someone to keep learning despite challenges.",
    "How do you stay patient and supportive when students are struggling to grasp a topic?",
    "What strategies do you use to keep your lessons organized and engaging?",
    "How do you handle stressful teaching situations, such as when multiple students are confused?"
]

# --- Subject Knowledge Questions (easy → hard) ---
subject_questions = {
    "Maths": [
        ("What is the derivative of x²?", "2x"),
        ("Solve for x: 2x + 5 = 15", "5"),
        ("What is the integral of sin(x)?", "-cos(x) + C"),
        ("Explain the difference between permutation and combination.", "Permutation = order matters, Combination = order doesn’t"),
        ("Prove that √2 is irrational.", "Proof by contradiction with even/odd integers")
    ],
    "Physics": [
        ("State Newton’s Second Law of Motion.", "F = ma"),
        ("What is the SI unit of force?", "Newton"),
        ("What is the difference between speed and velocity?", "Speed = scalar, Velocity = vector"),
        ("Explain the concept of relativity of simultaneity.", "Events can occur simultaneously in one frame but not in another"),
        ("Derive the expression for kinetic energy in terms of momentum.", "KE = p² / 2m")
    ],
    "Chemistry": [
        ("What is the atomic number of Oxygen?", "8"),
        ("Write the balanced equation for combustion of methane (CH₄).", "CH4 + 2O2 → CO2 + 2H2O"),
        ("What is the pH of a neutral solution at 25°C?", "7"),
        ("Explain Le Chatelier’s principle with an example.", "System shifts to counteract change"),
        ("Explain hybridization in methane (CH₄).", "sp³ hybridization")
    ],
    "Biology": [
        ("What is the basic structural and functional unit of life?", "Cell"),
        ("What is the role of mitochondria in a cell?", "Powerhouse, produces ATP"),
        ("Explain the process of transcription in protein synthesis.", "DNA → mRNA using RNA polymerase"),
        ("What is the difference between mitosis and meiosis?", "Mitosis = identical cells, Meiosis = gametes with half chromosomes"),
        ("Explain the theory of natural selection by Darwin.", "Survival of fittest through variation and selection")
    ]
}

def score_personality(responses):
    """Compute personality score from text responses"""
    embeddings = [get_embedding(r).squeeze(0).numpy() for r in responses]
    avg_embedding = np.mean(embeddings, axis=0)
    # Map embedding norm to 1-10 scale
    score = np.linalg.norm(avg_embedding) % 10 + 1
    return round(score, 1)

def score_knowledge(responses, correct_answers):
    """Compute knowledge depth score using cosine similarity"""
    scores = []
    for tutor_ans, correct_ans in zip(responses, correct_answers):
        tutor_emb = get_embedding(tutor_ans)
        correct_emb = get_embedding(correct_ans)
        sim = torch.cosine_similarity(tutor_emb, correct_emb, dim=1).item()  # 0 to 1
        scores.append(sim)
    avg_sim = np.mean(scores)
    knowledge_score = avg_sim * 10  # scale 0-10
    return round(knowledge_score, 1)

# --- Main Execution ---
# Step 1: Ask subject first (case-insensitive)
subject = ""
valid_subjects = list(subject_questions.keys())

while True:
    subject_input = input("Enter the subject you want to teach (Maths/Physics/Chemistry/Biology): ")
    subject = subject_input.strip().lower().capitalize()  # normalize input
    if subject in valid_subjects:
        break
    else:
        print("⚠️ Invalid subject. Please enter one of:", ", ".join(valid_subjects))

# Step 2: Ask knowledge questions
knowledge_questions = [q[0] for q in subject_questions[subject]]
correct_answers = [q[1] for q in subject_questions[subject]]

knowledge_responses = []
print(f"\nAnswer the following {subject} questions (in detail where necessary):")
for q in knowledge_questions:
    ans = input(q + " ")
    knowledge_responses.append(ans)

# Step 3: Ask personality questions (force long answers)
personality_responses = []
print("\nNow answer the following personality questions (at least 2-3 sentences each):")
for q in personality_questions:
    ans = ""
    while len(ans.split()) < 8:  # enforce minimum length
        ans = input(q + " ")
        if len(ans.split()) < 8:
            print("⚠️ Please write a longer response (at least 2-3 sentences).")
    personality_responses.append(ans)

# Step 4: Calculate scores
personality_score = score_personality(personality_responses)
knowledge_score = score_knowledge(knowledge_responses, correct_answers)
final_score = round((personality_score + knowledge_score) / 2, 1)

# Step 5: Show results
print("\n--- Assessment Results ---")
print(f"Personality Score: {personality_score}/10")
print(f"Knowledge Depth Score ({subject}): {knowledge_score}/10")
print(f"✅ Final Test Score: {final_score}/10")
