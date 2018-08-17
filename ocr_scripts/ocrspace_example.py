# -*- coding: utf-8 -*-
import requests
import sys
import json
import stringMatcher


def ocr_space_file(filename, overlay=False, api_key='477270ac5f88957', language='eng'):
    """ OCR.space API request with local file.
        Python3.5 - not tested on 2.7
    :param filename: Your file path & name.
    :param overlay: Is OCR.space overlay required in your response.
                    Defaults to False.
    :param api_key: OCR.space API key.
                    Defaults to 'helloworld'.
    :param language: Language code to be used in OCR.
                    List of available language codes can be found on https://ocr.space/OCRAPI
                    Defaults to 'en'.
    :return: Result in JSON format.
    """

    payload = {'isOverlayRequired': overlay,
               'apikey': api_key,
               'language': language,
               }
    with open(filename, 'rb') as f:
        r = requests.post('https://api.ocr.space/parse/image',
                          files={filename: f},
                          data=payload,
                          )
    return r.content.decode('utf-8')


def ocr_space_url(url, overlay=False, api_key='477270ac5f88957', language='eng'):
    """ OCR.space API request with remote file.
        Python3.5 - not tested on 2.7
    :param url: Image url.
    :param overlay: Is OCR.space overlay required in your response.
                    Defaults to False.
    :param api_key: OCR.space API key.
                    Defaults to 'helloworld'.
    :param language: Language code to be used in OCR.
                    List of available language codes can be found on https://ocr.space/OCRAPI
                    Defaults to 'en'.
    :return: Result in JSON format.
    """

    payload = {'url': url,
               'isOverlayRequired': overlay,
               'apikey': api_key,
               'language': language,
               }
    r = requests.post('https://api.ocr.space/parse/image',
                      data=payload,
                      )
    return r.content.decode('utf-8')


# Use examples:
# test_file = ocr_space_file(filename='IB.pdf', language='eng')
# test_url = ocr_space_url(url='http://dl.a9t9.com/ocrbenchmark/eng.png')
# test_url = ocr_space_url(url='http://ibocr.herokuapp.com/IB.pdf')


test_url = ocr_space_url(url='http://ibocr.herokuapp.com/IBcert.png')
# test_url = ocr_space_url(url=sys.argv[1])
converted_json = json.loads(test_url)
parsedtext = converted_json["ParsedResults"][0]["ParsedText"]

subject_list = [str(parsedtext.split("\r\n")[5]), str(parsedtext.split("\r\n")[6]), str(parsedtext.split("\r\n")[7]), str(parsedtext.split("\r\n")[18]), str(parsedtext.split("\r\n")[20]),str(parsedtext.split("\r\n")[21])]
results_list = stringMatcher.stringMatcher(subject_list)

scores_list = [str(parsedtext.split("\r\n")[11]), str(parsedtext.split("\r\n")[12]), str(parsedtext.split("\r\n")[13]), str(parsedtext.split("\r\n")[24]), str(parsedtext.split("\r\n")[25]), str(parsedtext.split("\r\n")[26])]
total_score = str(parsedtext.split("\r\n")[27])

name = str(parsedtext.split("\r\n")[3])
institution = str(parsedtext.split("\r\n")[4])

name = name.strip()
institution = institution.strip()
total_score = total_score.strip()
scores_list = [i.strip() for i in scores_list]

name_list = [name]
institution_list = [institution]
total_score_list = [total_score]

combined_list = name_list + institution_list + total_score_list + results_list + scores_list
combined_string = ",".join(combined_list)


print combined_string

# for i in results_list:
#     print (i)
