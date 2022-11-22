STACK_NAME=database-tester
reg?=us-east-1
REGION=$(reg)
BUCKET_NAME=database-tester-$(reg)


.PHONY: deploy

bucket:
	aws s3 mb s3://$(BUCKET_NAME) --region $(REGION)

deploy: node_modules
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME)
	sam deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION)

node_modules:
	npm install --prefix src

destroy:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION)
	aws s3 rb s3://$(BUCKET_NAME) --force --region $(REGION)
