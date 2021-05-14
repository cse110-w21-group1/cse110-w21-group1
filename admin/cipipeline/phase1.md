# Status of the Pipeline

## Linting and code style enforcement (may happen in pipeline and/or in editor)
- Before commiting formatting should be checked via Visual studio code formatting
- Install Prettier extension to double check it

## Code quality via tool  (ex. Codeclimate, Codacy, etc.)
- CodeFactor has been integrated into this repo and will send notifications with every commit to the slack channel code-factor
- We decided to choose CodeFactor because it is free and will ensure that our code meets the quality standarts

## Code quality via human review (ex. Pull Requests)
- Before commiting make sure that the code is functional and doesn’t contain obvious errors
- All the pull requests from feature branches will be manually reviewed by the team member before merging with development branch 
- Will also review more complicated changes to code during team review meetings


## Unit tests via automation (ex. Jest, Tape, Ava, Cypress, Mocha/Chai, etc.)*
- Will install Mocha which is a test framework running on Node.js
- Decided to pick Mocha bevause it has a clear documentation and we love Mocha(drink)
- Testing will mostly happen on the devevlopment branch after it has been peer-reviewed

## Documentation generation via automation (ex. JSDocs)
- Decided to go with JSDocs to automate the creation of the documentation
- This will run only after all the tests were cleared

