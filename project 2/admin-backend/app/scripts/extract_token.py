import sys
import json

try:
    data = json.load(sys.stdin)
    print(data.get('access_token', ''))
except Exception as e:
    print('')
