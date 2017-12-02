#!/usr/bin/python3

import boto3
import datetime
import sys

cw = boto3.client('cloudwatch')
ec2 = boto3.resource('ec2')

def get_metrics(instance_id):
    response = cw.get_metric_statistics(
        Period=300,
        StartTime=datetime.datetime.utcnow() - datetime.timedelta(seconds=6000),
        EndTime=datetime.datetime.utcnow(),
        MetricName='CPUUtilization',
        Namespace='AWS/EC2',
        Statistics=['Average'],
        Dimensions=[{'Name': 'InstanceId', 'Value':instance_id}]
        )
    # if len(response['Datapoints']) != 0:
    print('\nTimeStamp', '\t\t\tUnit', '\t\tAverage')
    for datapoint in response['Datapoints']:
        print(datapoint['Timestamp'], '\t' + datapoint['Unit'], '\t' + str(datapoint['Average']))
    

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
                choice = input("Enter number of instance: ")
                return instance_dict[choice]  # Get's public ip from dictionary and return
            except Exception as error:
                print("Error: Not a valid option" + str(error))


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
            get_metrics(get_instance_ip())
        elif choice == "0":
            print("Exiting")
            sys.exit(0)
        else:
            print("Not a valid choice")


# This is the standard boilerplate that calls the main() function.
if __name__ == "__main__":
    main()
