#!/usr/bin/python3

import boto3
import datetime
import sys

cw = boto3.client('cloudwatch')

def get_metrics():
    response = cw.get_metric_statistics(
        Period=300,
        StartTime=datetime.datetime.utcnow() - datetime.timedelta(seconds=6000),
        EndTime=datetime.datetime.utcnow(),
        MetricName='CPUUtilization',
        Namespace='AWS/EC2',
        Statistics=['Average'],
        Dimensions=[{'Name': 'InstanceId', 'Value':'i-02ec726f1bd6e90d8'}]
        )

    print(response['Datapoints'])


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
            get_metrics()
        elif choice == "0":
            print("Exiting")
            sys.exit(0)
        else:
            print("Not a valid choice")


# This is the standard boilerplate that calls the main() function.
if __name__ == "__main__":
    main()
