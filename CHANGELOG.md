# Changelog

Since i hack this in a few hours, i didn't commit every change, so here is my path in this project

- Create boilerplate index file with all the basic koa configuration
- Add .env file dependence and validation
- Create router class
- Create validation lib
- Create routes
- Create httpCodes global because the statusCode were magic numbers and the lint was complaning
- Add Joi to validate data and create Schemas
- Create error handler lib because the erros was getting in the way of the code and being all mess up
- Realize that creating the erro handler lib made stripe handle all the errors magicly
- Clean error output
- Create request log at index.js line 45 because i could not test the routes properly
- Write the tests. I didn't do TDD because i didn't make the architecture first, so i had no idea regarding the output or how i was going to actually make the api
- Run into a problem with mucha and async tests, stack overflow it ftw! Found the solution and search mocha code for the reason, didn't find it. But found a lot of issues and tickets over the internet
- Make sure the tests were 100% coverage
- Last test
- Create changelog file
