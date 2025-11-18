# utils.py
import inflect

def convert_to_words(amount):
    """
    Convert a numeric amount to words and append 'rupees only'.
    """
    p = inflect.engine()
    words = p.number_to_words(amount).replace(", and", "").replace(",", "")
    return f"{words} rupees only"
