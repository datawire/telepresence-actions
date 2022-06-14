.PHONY: help
.DEFAULT_GOAL := help

dist/connect: ## Generates dist files for the connect action
	@echo '🔨Building connect'
	cd connect; ncc build connect.js -o dist/connect
	cd connect; ncc build disconnect.js -o dist/disconnect
	@echo '✅ Built connect'

dist/configure: ## Generates dist files for the configure action
	@echo '🔨Building configure'
	cd configure; ncc build configure.js -o dist/configure
	@echo '✅ Built configure'

dist/login: ## Generates the dist files for the login action
	@echo '🔨Building login'
	cd login; ncc build login.js -o dist/login
	cd login; ncc build logout.js -o dist/logout
	@echo '✅ Built login'

dist/intercept: ## Generates the dist files for the intercept action
	@echo '🔨Building intercept'
	cd intercept; ncc build intercept.js -o dist/intercept
	cd intercept; ncc build leave.js -o dist/leave
	@echo '✅ Built intercept'

dist/install: ## Generates the dist files for the install action
	@echo '🔨Building install'
	cd install; ncc build install.js -o dist/install
	cd install; ncc build pre-install.js -o dist/preinstall
	@echo '✅ Built install'


dist/clean: ## Removes all actions dist files
	rm -r connect/dist
	rm -r configure/dist
	rm -r login/dist
	rm -r intercept/dist
	rm -r install/dist

dist: dist/connect dist/configure dist/login dist/intercept dist/install ## Generates all actions dist files
	@echo '🎉 done building dist files'

help: ## Displays this help message
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_\/-]+:.*?## / {printf "\033[34m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | \
		sort | \
		grep -v '#'
