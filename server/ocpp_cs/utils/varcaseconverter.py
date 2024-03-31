import humps


def snake_to_camel_case(data: dict):
    new_data = {}
    for key, value in data.items():
        new_key = humps.camelize(key)
        new_data[new_key] = value
    return new_data
