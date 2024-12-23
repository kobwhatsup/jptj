import sys
import json

def format_response(response_data):
    try:
        data = json.loads(response_data)
        return json.dumps(data, ensure_ascii=False, indent=2)
    except json.JSONDecodeError:
        return response_data

if __name__ == "__main__":
    input_data = sys.stdin.read()
    print(format_response(input_data))
