#!/usr/bin/python3

import boto3
import datetime
import sys

cw = boto3.client('cloudwatch')
ec2 = boto3.resource('ec2')

ec2_metrics = { '1': 'CPUUtilization', '2': 'DiskReadOps', '3': 'DiskWriteOps', 
'4': 'DiskReadBytes', '5': 'DiskWriteBytes', '6': 'NetworkIn', '7': 'NetworkOut', '8': 'NetworkPacketsIn', '9': 'NetworkPacketsOut'}

ec2_stats = {'1': 'Minimum', '2': 'Maximum', '3': 'Sum', '4': 'Average', '5': 'SampleCount'}

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
        print('\n' + metric)
        print('TimeStamp', '\t\t\tUnit', '\t' + stats)
        for datapoint in sorted(response['Datapoints'], key=lambda x:x['Timestamp']): # sort datapoints by timestamp
            print(datapoint['Timestamp'], '\t' + datapoint['Unit'], '\t' + str(datapoint[stats]))
    else:
        print('\nThere are no datapoints for metric: ' + metric)
    

# List instances 
def get_instance_ip():
    instance_dict = {}  # Create empty dictionary
    i = 1  # Value to iterate as key for dictionary
    print('\n#', '\tInstance ID', '\t\tPublic IP Adrress')
    for instance in ec2.instances.all():
        if instance.state['Name'] == 'running':  # for only instances that are running
            instance_dict[str(i)] = instance.id  # map current value of i as key to public address value
            print(i, '\t' + instance.id, '\t' + str(instance.public_ip_address))
            i += 1
    if len(instance_dict) == 0:  # if there are no instances running
        print("You have no instances. Create one at the main menu")
        time.sleep(3)
    else:  # if there are running instances, get input from user to get instance public ip
        while True:
            try:
                choice = input("\nEnter number of instance: ")
                return instance_dict[choice]  # Get's public ip from dictionary and return
            except Exception as error:
                print("\nError: Not a valid option" + str(error))

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

# Main menu of script
def menu():
    print('''
Welcome
    1. CPU Utilisation 
    ===================
    0. Exit''')


# Main function
def main():
    while True:
        menu()
        choice = input("\nEnter your choice: ")
        if choice == "1":
            get_metrics(get_metric_name(), get_stats_name(), get_instance_ip())
        elif choice == "2":
            get_stats_name()
        elif choice == "0":
            print("Exiting")
            sys.exit(0)
        else:
            print("Not a valid choice")


# This is the standard boilerplate that calls the main() function.
if __name__ == "__main__":
    main()
python