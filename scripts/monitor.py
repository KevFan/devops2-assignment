#!/usr/bin/python3

import boto3
import datetime
import sys
import time
import subprocess
from utils import get_valid_key

cw = boto3.client('cloudwatch')
ec2 = boto3.resource('ec2')

# Dictionary of ec2 metric types
ec2_metrics = { '1': 'CPUUtilization', '2': 'DiskReadOps', '3': 'DiskWriteOps', 
'4': 'DiskReadBytes', '5': 'DiskWriteBytes', '6': 'NetworkIn', '7': 'NetworkOut', '8': 'NetworkPacketsIn', '9': 'NetworkPacketsOut'}

# Dictionary of ec2 statistic types
ec2_stats = {'1': 'Minimum', '2': 'Maximum', '3': 'Sum', '4': 'Average', '5': 'SampleCount'}

# Function to get datapoint metrics by metric type, statistic type and instance id
# Gets the data points in the last 100 minutes and sorts them by the timestamp
def get_metrics(metric, stats, instance_id):
    response = cw.get_metric_statistics(
        Period=300,
        StartTime=datetime.datetime.utcnow() - datetime.timedelta(seconds=6000),
        EndTime=datetime.datetime.utcnow(),
        MetricName=metric,
        Namespace='AWS/EC2',
        Statistics=[stats],
        Dimensions=[{'Name': 'InstanceId', 'Value':instance_id}]
        )
    if len(response['Datapoints']) != 0:
        print('\n' + metric + ' - in last 100 minutes in 5 minute periods')
        print('TimeStamp', '\t\t\tUnit', '\t' + stats)
        for datapoint in sorted(response['Datapoints'], key=lambda x:x['Timestamp']): # sort datapoints by timestamp
            print(datapoint['Timestamp'], '\t' + datapoint['Unit'], '\t' + str(datapoint[stats]))
    else:
        print('\nThere are no datapoints for metric: ' + metric + ' - in last 100 minutes')
    

# List running instances and asks user to select a running instance
# Returns the selected instance id or public ip address
def get_instance_detail(id_or_ip):
    instance_dict = {}  # Create empty dictionary
    i = 1  # Value to iterate as key for dictionary
    print('\n#', '\tInstance ID', '\t\tPublic IP Adrress', '\tName')
    for instance in ec2.instances.all():
        if instance.state['Name'] == 'running':  # for only instances that are running
            if id_or_ip == 'id':
                instance_dict[str(i)] = instance.id  # map current value of i as key to instance id
            else:
                instance_dict[str(i)] = instance.public_ip_address # map current value of i as key to public ip
            instance_name = '' # Get instance tag name
            for tag in instance.tags:
                if tag['Key'] == 'Name':
                    instance_name = tag['Value']
            print(i, '\t' + instance.id, '\t' + str(instance.public_ip_address), '\t\t' + str(instance_name))
            i += 1
    if len(instance_dict) == 0:  # if there are no instances running
        print("You have no running instances. Must have a running instance to get metrics :( ")
        time.sleep(3)
    else:  # if there are running instances, get input from user to get instance id
        while True:
            try:
                choice = input("\nEnter number of instance: ")
                return instance_dict[choice]  # Get's instance id from dictionary and return
            except Exception as error:
                print("\nError: Not a valid option" + str(error))

# Prints metric types and asks user for metric type selection and returns it
def get_metric_name():
    print('\n#', '\tMetric')     
    for key in sorted(ec2_metrics):
        print(key, '\t' + ec2_metrics[key])

    while True:
        try:
            choice = input("\nEnter metric choice: ")
            return ec2_metrics[choice]  # Get's public ip from dictionary and return
        except Exception as error:
            print("\nError: Not a valid option" + str(error))

# Prints stats types and asks user for stats type selection and returns it
def get_stats_name():
    print('\n#', '\tStatistics')     
    for key in sorted(ec2_stats):
        print(key, '\t' + ec2_stats[key])

    while True:
        try:
            choice = input("\nEnter statistic choice: ")
            return ec2_stats[choice]  # Get's public ip from dictionary and return
        except Exception as error:
            print("\nError: Not a valid option" + str(error))

def tail_access_logs(key, ip):
    cmd = " 'sudo tail -n 50 /var/log/nginx/access.log'"
    (status, output) = subprocess.getstatusoutput(construct_ssh(key, ip, cmd))
    if status == 0:
        print(output)
    else:
        print('Error: ' + str(status) + ' output: ' + output)
        print()

# Helper to construct ssh command to reduce duplication
def construct_ssh(key_path, public_ip, cmd):
    return "ssh -t -o StrictHostKeyChecking=no -i " + key_path + " ec2-user@" + public_ip + cmd


def return_menu():
    input('\nPress any key to return to main menu...')

# Main menu of script
def menu():
    print('''
Welcome
    1. Get Metrics!! 
    2. Tail Nginx Access logs
    ===================
    0. Exit''')


# Main function
def main():
    while True:
        menu()
        choice = input("\nEnter your choice: ")
        if choice == "1":
            instance_id = get_instance_detail('id')
            if instance_id:
                get_metrics(get_metric_name(), get_stats_name(), instance_id)
                return_menu()
        elif choice == "2":
            ip = get_instance_detail('ip')
            if ip:
                key = get_valid_key('Enter path to key: ')
                tail_access_logs(key, ip)
                return_menu()
        elif choice == "0":
            print("Exiting")
            sys.exit(0)
        else:
            print("Not a valid choice")


# This is the standard boilerplate that calls the main() function.
if __name__ == "__main__":
    main()