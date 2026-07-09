"""
Add missing French diacritics to the `fr` block of AssistantDock.tsx.

Operates ONLY on the `fr: {` block. Uses whole-word, case-preserving
replacements so English keywords and identifiers are not corrupted.
"""
import re

PATH = 'src/components/AssistantDock.tsx'

# Accentless (lowercase) -> accented French. Only words confirmed present in
# the fr block are listed, to keep the operation surgical and predictable.
CORRECTIONS = {
    'acces': 'accès',
    'algerie': 'Algérie',
    'alger': 'Alger',
    'batiment': 'bâtiment',
    'capacites': 'capacités',
    'competences': 'compétences',
    'complete': 'complète',
    'completee': 'complétée',
    'cout': 'coût',
    'couts': 'coûts',
    'deja': 'déjà',
    'delai': 'délai',
    'delais': 'délais',
    'demarrer': 'démarrer',
    'deroulement': 'déroulement',
    'developpement': 'développement',
    'donnees': 'données',
    'ecrivez': 'écrivez',
    'equipe': 'équipe',
    'equipes': 'équipes',
    'etape': 'étape',
    'etapes': 'étapes',
    'meme': 'même',
    'memes': 'mêmes',
    'methode': 'méthode',
    'methodes': 'méthodes',
    'oeuvre': 'œuvre',
    'precise': 'précise',
    'precisez': 'précisez',
    'prefere': 'préféré',
    'preferee': 'préférée',
    'premiere': 'première',
    'qualite': 'qualité',
    'reference': 'référence',
    'references': 'références',
    'reponse': 'réponse',
    'reseau': 'réseau',
    'reseaux': 'réseaux',
    'residentiel': 'résidentiel',
    'residentielle': 'résidentielle',
    'residentiels': 'résidentiels',
    'serieux': 'sérieux',
    'telephone': 'téléphone',
    'telephones': 'téléphones',
    'tres': 'très',
    'visee': 'visée',
    'operateur': 'opérateur',
    'numero': 'numéro',
    'coordonnees': 'coordonnées',
    'etait': 'était',
    'cote': 'côté',
    'cotes': 'côtés',
    'basee': 'basée',
    'basees': 'basées',
    'coordonnee': 'coordonnée',
    'coordonnees': 'coordonnées',
    'coordonnes': 'coordonnés',
    'premier': 'premier',
    'premieres': 'premières',
    'preparee': 'préparée',
    'preparees': 'préparées',
    'prevu': 'prévu',
    'prevue': 'prévue',
    'prevues': 'prévues',
    'presente': 'présente',
    'presentes': 'présentes',
    'termine': 'terminé',
    'termines': 'terminés',
    'terminees': 'terminées',
    'premiere': 'première',
    'interesse': 'intéressé',
    'interessees': 'intéressées',
    'facade': 'façade',
    'facades': 'façades',
    'materiaux': 'matériaux',
    'residences': 'résidences',
    'residence': 'résidence',
    'unites': 'unités',
    'unite': 'unité',
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

    start_idx = text.find('  fr: {')
    if start_idx == -1:
        raise SystemExit('Could not find fr block')
    end_idx = text.find('});', start_idx)
    if end_idx == -1:
        raise SystemExit('Could not find end of fr block')

    before = text[:start_idx]
    block = text[start_idx:end_idx]
    after = text[end_idx:]

    def repl(match):
        word = match.group(0)
        lower = word.lower()
        if lower in CORRECTIONS:
            return preserve_case(word, CORRECTIONS[lower])
        return word

    block = re.sub(r"[A-Za-zÀ-ÿ]+(?:[-'][A-Za-zÀ-ÿ]+)*", repl, block)

    # Standalone preposition "a" -> "à" (e.g. "basee a Ouled Fayet", "a Alger",
    # "a la premiere"). Only between whitespace boundaries to avoid matching
    # "a" inside identifiers or English keywords like "data".
    block = re.sub(r"(?<=\s)a(?=\s)", 'à', block)

    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(before + block + after)

    print('Diacritics applied to AssistantDock.tsx fr block.')


if __name__ == '__main__':
    main()
