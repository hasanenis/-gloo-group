"""
Add missing French diacritics to French strings in ProjectDetail.tsx.

The French content lives as the second argument of localValue(en, fr) calls
and a few inline ternaries. These specific accentless French words do not
appear in the English content of this file, so whole-word file-wide
replacement is safe.
"""
import re

PATH = 'src/pages/ProjectDetail.tsx'

# lowercase accentless -> accented
CORRECTIONS = {
    'algerie': 'Algérie',
    'acces': 'accès',
    'controle': 'contrôle',
    'achevement': 'achèvement',
    'delais': 'délais',
    'residentiel': 'résidentiel',
    'residentielle': 'résidentielle',
    'residentiels': 'résidentiels',
    'acheve': 'achevé',
    'achevee': 'achevée',
    'realisation': 'réalisation',
    'realise': 'réalisé',
    'realiser': 'réaliser',
    'interieure': 'intérieure',
    'interieurs': 'intérieurs',
    'interieures': 'intérieures',
    'proximite': 'proximité',
    'pole': 'pôle',
    'poles': 'pôles',
    'activites': 'activités',
    'accessibilite': 'accessibilité',
    'fonctionnalite': 'fonctionnalité',
    'facades': 'façades',
    'facade': 'façade',
    'reseaux': 'réseaux',
    'reseau': 'réseau',
    'arme': 'armé',
    'equipement': 'équipement',
    'lumiere': 'lumière',
    'verriere': 'verrière',
    'identite': 'identité',
    'beton': 'béton',
    'decoratifs': 'décoratifs',
    'vitrees': 'vitrées',
    'amenages': 'aménagés',
    'commercants': 'commerçants',
    'prets': 'prêts',
    'economique': 'économique',
    'repondant': 'répondant',
    'operation': 'opération',
    'execution': 'exécution',
    'etat': 'état',
    'coordonne': 'coordonné',
    'livre': 'livré',
}


def preserve_case(original, replacement):
    if original.isupper():
        return replacement.upper()
    if len(original) > 1 and original[0].isupper() and original[1:].islower():
        return replacement[0].upper() + replacement[1:]
    return replacement


def main():
    with open(PATH, encoding='utf-8') as f:
        text = f.read()

    def repl(match):
        word = match.group(0)
        lower = word.lower()
        if lower in CORRECTIONS:
            return preserve_case(word, CORRECTIONS[lower])
        return word

    text = re.sub(r"[A-Za-zÀ-ÿ]+(?:[-'][A-Za-zÀ-ÿ]+)*", repl, text)

    # NOTE: standalone "a" -> "à" is intentionally NOT applied file-wide,
    # because ProjectDetail.tsx contains English prose where "a" is the
    # article (e.g. "a modern commercial building"). The French preposition
    # "à" inside fr strings is handled with targeted phrase replacements.

    # Targeted French phrase corrections (appear only in fr strings).
    phrase_fixes = [
        (' a l interieur', " à l'intérieur"),
        (" a l'interieur", " à l'intérieur"),
        (' a travers', ' à travers'),
        (' a la valorisation', ' à la valorisation'),
        (' au dynamisme economique', ' au dynamisme économique'),
        ('contribue a la', 'contribue à la'),
        (' a la premiere', ' à la première'),
        ('corps d etat', "corps d'état"),
        ('d etat secondaires', "d'état secondaires"),
        ("corps d'etat", "corps d'état"),
        ("l interieur", "l'intérieur"),
        ("l identite", "l'identité"),
        ("l accessibilite", "l'accessibilité"),
        ("l equipe", "l'équipe"),
        ("d un escalier", "d'un escalier"),
        ("d activites", "d'activités"),
        ("a realise", "a réalisé"),
        ("a l ensemble", "à l'ensemble"),
        ("en beton arme", "en béton armé"),
        ("surfaces vitrees", "surfaces vitrées"),
        ("a des elements", "à des éléments"),
        ("elements decoratifs", "éléments décoratifs"),
    ]
    for old, new in phrase_fixes:
        text = text.replace(old, new)

    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(text)

    print('Diacritics applied to ProjectDetail.tsx.')


if __name__ == '__main__':
    main()
