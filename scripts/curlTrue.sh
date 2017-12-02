#!/bin/bash
# Simple curl script to constantly curl load balancer dns
while true;
do
	# curl <load-balancer-dns/route>
	curl http://load-balancer-2146252554.eu-west-1.elb.amazonaws.com/testlb/curl;
done

