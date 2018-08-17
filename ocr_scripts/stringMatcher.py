from difflib import SequenceMatcher


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def stringMatcher(subject_list):
    ibsubjects_list = ["ENGLISH", "CHEMISTRY", "ECONOMICS", "PHYSICS", "MATHEMATICS", "FRENCH"]
    confidence_levels = []
    results_list = []

    # scannedsubject = parsedtext.split("\r\n")[18]
    # scannedsubject = "ENGLISH A "

    for sl in subject_list:
        for i in range(len(ibsubjects_list)):
            cl = similar(sl, ibsubjects_list[i])
            confidence_levels.append(cl)

        index = confidence_levels.index(max(confidence_levels))
        results_list.append(ibsubjects_list[index])
        confidence_levels = []

    return results_list
