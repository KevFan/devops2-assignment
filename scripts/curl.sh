#!/bin/bash
# Simple curl script to curl load balancer dns + application specific route
for value in {1..100}
do
	printf "\n$value "
	# curl <load-balancer-dns/route>
	curl http://test-1234728960.eu-west-1.elb.amazonaws.com/testlb/$value
done
	printf "\nAll done\n"
