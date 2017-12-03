import os
import datetime
import subprocess
import boto3

# Return absolute file path2
def get_file_path(prompt):
    return os.path.abspath(os.path.expanduser(input(prompt)))

# Function that checks is user have a key with a key_name in their default region
def check_user_has_key(key_name):
    try:
        ec2 = boto3.client('ec2')
        response = ec2.describe_key_pairs(
            KeyNames=[
                key_name,
            ])
        if response:  # Assumes key is valid if the key_name matches, will throw error if it doesn't
            return True
    except Exception as error:
        print_and_log(error)
        return False


# Asks user to get input path to key for ssh
# Key is checked and only returns if valid
def get_valid_key(prompt):
    key_path = get_file_path(prompt)  # get user input of file path
    exit_boolean = False
    while exit_boolean is False:
        print('File path: ' + key_path)
        # check does file exist
        if os.path.exists(key_path) is False:
            key_path = get_file_path("Path does not exist - " + prompt)
        # check does file is a .pem file
        if key_path.endswith('.pem') is False:
            key_path = get_file_path("Expecting .pem file - " + prompt)
        # check the user has key with the name in default region
        if check_user_has_key(os.path.basename(key_path).split('.')[0]) is False:
            key_path = get_file_path("Re-" + prompt)
        # If key satisfies all the conditions above - exit loop
        if key_path.endswith('.pem') \
                and check_user_has_key(os.path.basename(key_path).split('.')[0]) \
                and os.path.exists(key_path):
            exit_boolean = True
            print("Key is valid in this region")
    return key_path


# Clear the terminal
def clear_screen():
    # assign to variable so that 0 doesnt display to terminal
    tmp = subprocess.call('clear', shell=True)
