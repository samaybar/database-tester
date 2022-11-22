STACK_NAME=database-tester
BUCKET_NAME=database-tester-use1
REGION=us-east-1
BUCKET_NAME2=database-tester-usw2
REGION2=us-west-2
BUCKET_NAME3=database-tester-apse1
REGION3=ap-southeast-1
BUCKET_NAME4=database-tester-euw2
REGION4=eu-west-2

.PHONY: deploy

bucket:
	aws s3 mb s3://$(BUCKET_NAME) --region $(REGION)

deploy: node_modules
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME)
	sam deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION)

deploy2: node_modules
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME2)
	sam deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION2)

deploy3: node_modules
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME3)
	sam deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION3)

deploy4: node_modules
	sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME4)
	sam deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION4)

node_modules:
	npm install --prefix src

destroy:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION)
	aws s3 rb s3://$(BUCKET_NAME) --force --region $(REGION)

destroy2:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION2)
	aws s3 rb s3://$(BUCKET_NAME2) --force --region $(REGION2)

destroy3:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION3)
	aws s3 rb s3://$(BUCKET_NAME3) --force --region $(REGION3)

destroy4:
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION4)
	aws s3 rb s3://$(BUCKET_NAME4) --force --region $(REGION4)