# AI Engineering Roadmap

This guide combines the learning outcomes, applied exercises and reading assignments for every module and lesson in the roadmap. It uses the editions supplied with the project and links to official documentation for libraries and protocols that change frequently.

## How to use this guide

1. Read the learning outcomes to understand what you should be able to explain, compare or decide.
2. Complete the required reading and any linked technical references assigned to the lesson before attempting its applied exercises. Both are required when the exercise depends on a current tool or API.
3. Use the recommended reading when you need another explanation or want to explore the topic further. Recommended reading must not be the only place an exercise prerequisite is taught.
4. Follow current official documentation while coding because APIs can change after a book is published. If a command in a book differs from the current documentation, use the current documentation and record the difference.
5. Complete the applied exercises and keep the self-check, such as code, tests, evaluations, traces or architecture decisions.

You complete the reading when you can explain the learning outcomes without copying the source. You complete the practice when the artefact works and demonstrates the stated capability.

**Prerequisite rule:** Complete lessons in order within a module. If an applied exercise uses a capability taught later, use a small self-contained example introduced in that lesson or defer that part of the build. Do not assume an evaluation set, agent loop, database or deployment environment exists before the roadmap has created it.

**Exercise scope:** The applied exercises define the required work. Reuse skills from completed lessons, but implement only the methods covered by the current required reading. Tasks explicitly labelled as extensions are optional and require their own reading before implementation. An experiment is complete when its method and results are recorded honestly, including regressions or no improvement. A blocked runtime benchmark must remain marked incomplete; a design or calculation must not be presented as an executed benchmark.

## Books

| Book | Author or authors |
| --- | --- |
| _Mathematics for Machine Learning_ | Deisenroth, Faisal and Ong |
| _Prompt Engineering for LLMs_ | Berryman and Ziegler |
| _Hands-On Machine Learning with Scikit-Learn and PyTorch_ | Géron |
| _Designing Data-Intensive Applications_, 2nd ed. | Kleppmann and Riccomini |
| _Artificial Intelligence: A Modern Approach_ | Russell and Norvig |
| _Building LLMs for Production_ | Peters and Bouchard |
| _An Introduction to Statistical Learning with Applications in Python_ | James, Witten, Hastie and Tibshirani |
| _Designing Machine Learning Systems_ | Huyen |
| _Hands-On Large Language Models_ | Alammar and Grootendorst |
| _LLM Engineer's Handbook_ | Iusztin and Labonne |
| _Deep Reinforcement Learning with Python_ | Sanghi |
| _Build a Large Language Model (From Scratch)_ | Raschka |
| _Generative Deep Learning_ | Foster |
| _Deep Learning_ | Goodfellow, Bengio and Courville |
| _AI Engineering: Building Applications with Foundation Models_ | Huyen |
| _Machine Learning with PyTorch and Scikit-Learn_ | Raschka, Liu and Mirjalili |
| _Python Crash Course_, 3rd ed. | Matthes |
| _Hypermodern Python Tooling_ | Jolowicz |
| _Building Data Science Applications with FastAPI_, 2nd ed. (optional reference only) | Voron |

The roadmap does not require every supplied book from cover to cover. Use these books as optional references for further study:

- _Artificial Intelligence: A Modern Approach_
- _Deep Reinforcement Learning with Python_
- _Generative Deep Learning_
- _Building Data Science Applications with FastAPI_, 2nd ed. (conceptual examples only; use current FastAPI, Pydantic, SQLAlchemy and `uv` documentation for implementation)

For Modules 0 and 1, use the free [Python Developer Tooling Handbook](https://pydevtools.com/handbook/) and current official documentation as primary tooling sources. _Hypermodern Python Tooling_ remains valuable for packaging, dependency-resolution, testing and typing concepts. Its 2024 `uv pip` and Poetry examples are not the prescribed integrated `uv` project workflow.

### Optional additions

The context and MCP lessons include two optional books for deeper study:

- [_Hands-On Context Engineering_](https://www.oreilly.com/library/view/hands-on-context-engineering/0642572371005/) by Xinye Tang and Wei Sun
- [_Learn Model Context Protocol with Python_](https://www.oreilly.com/library/view/learn-model-context/9781806103232/) by Christoffer Noring

## Module 0: Advanced Python programming

**Module aim:** Make Python feel natural enough that it never obstructs the AI work.

**Module learning outcomes:** Use Python confidently as an experienced engineer, explaining its core syntax, type system, module model, failure handling and asynchronous execution.

**Module practical assessment:** Build a typed command-line API client with demonstrated behaviour checks. It should demonstrate clean Python structure, data transformation, file persistence, concurrent I/O and graceful failure handling without relying on an LLM. Add the formal automated test suite in lesson 1.6.

### 0.1 Python environments and dependency management

- **Learning outcomes:** Explain how interpreters, virtual environments and dependency files isolate a project and make its execution reproducible.
- **Applied exercises:** Initialise a small application with `uv`, add one runtime dependency and one development dependency, and commit `pyproject.toml`, `uv.lock`, a supported Python version and a README. Do not commit `.venv`. In a fresh checkout, run `uv sync --locked` and the documented `uv run` command to verify that the project can be recreated without machine-specific setup.
- **Self-check:** Explain the roles of the interpreter, `.venv`, `pyproject.toml` and `uv.lock`, then reproduce the project from a fresh checkout.

- **Required reading:** [Python Developer Tooling Handbook, "Create your first Python project with uv"](https://pydevtools.com/handbook/tutorial/create-your-first-python-project/), then ["Set up a complete Python project"](https://pydevtools.com/handbook/tutorial/set-up-a-complete-python-project/) through the dependency setup.
- **Recommended reading:** _Hypermodern Python Tooling_, Chapters 2-4, for environment isolation, `pyproject.toml`, direct versus transitive dependencies and locking concepts. Do not copy the book's older `uv pip` workflow into this project. _Python Crash Course_, 3rd ed., Chapter 1, "Getting Started", if you need basic interpreter setup.
- **Technical references:** [`uv` project guide](https://docs.astral.sh/uv/guides/projects/) and [locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/). Read the sections on `uv init`, `uv add`, `uv run`, `uv.lock` and `uv sync --locked`.

### 0.2 Python syntax and data types

- **Learning outcomes:** Translate familiar TypeScript concepts into Python while explaining Python data types, mutability, identity, equality, truthiness and `None`.
- **Applied exercises:** Write small scripts that transform strings, lists, tuples, sets and dictionaries. Show aliasing versus copying, mutation versus rebinding, `==` versus `is`, truthiness and `None` using printed before/after examples. Keep these as scripts until functions are introduced in lesson 0.4.
- **Self-check:** Show the Python collection and object semantics in concrete examples.

- **Required reading:** _Python Crash Course_, 3rd ed.:
  - Chapter 2, "Variables and Simple Data Types".
  - Chapter 3, "Introducing Lists".
  - Chapter 4, "Working with Lists".
  - Chapter 5, "if Statements".
  - Chapter 6, "Dictionaries".
- **Technical references:** [Python data model](https://docs.python.org/3/reference/datamodel.html) for object identity and mutability, and [truth value testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing).

### 0.3 Control flow and comprehensions

- **Learning outcomes:** Choose appropriately between conditionals, loops and comprehensions, and explain when readability should take priority over brevity.
- **Applied exercises:** Build a data-processing command that filters and summarises a list of API-shaped dictionaries. Group records with an ordinary dictionary and loop, then rewrite only the simple filtering step as a comprehension. Handle empty and malformed records explicitly.
- **Self-check:** Transform lists and dictionaries without copying examples.

- **Required reading:** _Python Crash Course_, 3rd ed.:
  - Chapter 4, "Working with Lists".
  - Chapter 5, "if Statements".
  - Chapter 6, "Dictionaries".
  - Chapter 7, "User Input and while Loops".
- **Technical references:** [Python tutorial, data structures](https://docs.python.org/3/tutorial/datastructures.html), especially list comprehensions and looping techniques.

### 0.4 Functions and modules

- **Learning outcomes:** Explain Python function arguments, scope, imports and module boundaries well enough to organise application code deliberately.
- **Applied exercises:** Refactor the lesson 0.3 script into importable modules with focused functions. Demonstrate positional, keyword and default arguments, and show that inputs and outputs remain predictable. Run it with `uv run` and import its functions from a second script. A pytest suite is introduced in lesson 1.6.
- **Self-check:** Demonstrate function arguments, imports and module boundaries without requiring a test framework.

- **Required reading:** _Python Crash Course_, 3rd ed., Chapter 8, "Functions"; _Hypermodern Python Tooling_, Chapter 3, "Python Packages", sections on modules, package layout and `pyproject.toml`.
- **Technical references:** [`uv` project structure](https://docs.astral.sh/uv/concepts/projects/layout/).

### 0.5 Object-oriented programming in Python

- **Learning outcomes:** Decide when a Python class adds value, and explain composition, inheritance and the responsibilities of a useful abstraction.
- **Applied exercises:** Build a record class with instance attributes and methods, plus a service that contains a data-source instance. Create two interchangeable data sources that return different in-memory examples through the same method. Show composition and one small inheritance example, explaining when each is useful. Add file I/O in lesson 0.6 and `Protocol` typing in 0.7.
- **Self-check:** Explain instance state, composition and simple inheritance with local classes.

- **Required reading:** _Python Crash Course_, 3rd ed., Chapter 9, "Classes", including composition and inheritance.

### 0.6 Exceptions and failure handling

- **Learning outcomes:** Distinguish recoverable failures from programming errors and explain exception propagation, custom exceptions and resource cleanup.
- **Applied exercises:** Add a file-backed data source to the lesson 0.5 service. Read and write a small JSON file using a context manager, then demonstrate a missing file, malformed JSON and invalid input. Raise and catch one custom domain exception, and explain why unexpected programming errors should propagate. Introduce network failure handling in lesson 0.9.
- **Self-check:** Show successful file persistence and deliberate, correctly handled failure paths.

- **Required reading:** _Python Crash Course_, 3rd ed., Chapter 10, "Files and Exceptions".
- **Technical references:** [Python tutorial, errors and exceptions](https://docs.python.org/3/tutorial/errors.html) for custom exceptions and cleanup.

### 0.7 Type hints and static analysis

- **Learning outcomes:** Explain what type hints can and cannot guarantee, and use unions, optional values, collections and typed return values correctly.
- **Applied exercises:** Annotate the public functions and data-source interface with collection types, optional values, unions and a small `Protocol`. Run the chosen static checker, deliberately introduce one incompatible call so it reports an error, then fix it. Show separately that annotations do not perform runtime validation. Add a small `Protocol` for the two data sources from 0.5, type the public boundaries, and run the chosen checker with `uv run`.
- **Self-check:** Demonstrate a detected static type error and explain what still needs runtime checking.

- **Required reading:** _Hypermodern Python Tooling_, Chapter 10, "Using Types for Safety and Inspection", through protocols and static checking with mypy.
- **Technical references:** [Python typing documentation](https://docs.python.org/3/library/typing.html) and the [Python Developer Tooling Handbook type-checking guide](https://pydevtools.com/handbook/topics/type-checking/). Use one checker consistently, either mypy as in the book or the checker from the handbook tutorial.

### 0.8 Iterators, generators and lazy evaluation

- **Learning outcomes:** Explain lazy evaluation, the iteration protocol and the memory tradeoffs between generators and materialised collections.
- **Applied exercises:** Write a generator that yields one record at a time from a local JSON Lines file, reusing file handling from 0.6. Consume only the first few records, then iterate over the rest. Compare this with building a list of all records and explain when reading and allocation happen. Network pagination and memory-profiler tooling are not required.
- **Self-check:** Show lazy iteration and explain why the generator does not materialise the whole input.

- **Required reading:** [Python tutorial, iterators and generators](https://docs.python.org/3/tutorial/classes.html#iterators) and [generator expressions](https://docs.python.org/3/tutorial/classes.html#generator-expressions).
- **Recommended reading:** _Hypermodern Python Tooling_, Chapter 10, section on annotating iterators and generators.

### 0.9 Asynchronous I/O and concurrency

- **Learning outcomes:** Explain the event loop, coroutines and tasks, including the difference between concurrency, parallelism and blocking work.
- **Applied exercises:** Build an HTTPX API aggregator using coroutines, tasks and a semaphore. Run the same request list sequentially and with a fixed concurrency bound; record elapsed time and successful/failed requests. Demonstrate a timeout and an unsuccessful HTTP status without losing the successful results. Explain why blocking work would obstruct the event loop. Use a small public or locally mocked HTTP endpoint. Cover an HTTP timeout and a failed response; use the same request list for sequential execution and execution with a fixed concurrency bound.
- **Self-check:** Compare the same request workload sequentially and concurrently, with explicit timeout handling.

- **Required reading:** [Python `asyncio` overview](https://docs.python.org/3/library/asyncio.html), [coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html), and [synchronisation primitives](https://docs.python.org/3/library/asyncio-sync.html), especially semaphores.
- **Technical references:** [HTTPX async support](https://www.python-httpx.org/async/) and [timeouts](https://www.python-httpx.org/advanced/timeouts/). These teach the client required for the aggregator.

## Module 1: API engineering with FastAPI

**Module aim:** Turn Python fluency into a backend foundation you can reuse in every AI product.

**Module learning outcomes:** Explain how a production-minded Python API handles HTTP boundaries, validation, dependencies, persistence, security, tests and deployment.

**Module practical assessment:** Build a containerised FastAPI service with typed schemas, PostgreSQL persistence, authentication and async tests. It should demonstrate modular boundaries and production-ready backend habits.

### 1.1 REST API design with FastAPI

- **Learning outcomes:** Explain how HTTP methods, status codes, routing, validation and the FastAPI request lifecycle combine to form a well-designed REST API.
- **Applied exercises:** Turn the Module 0 utility into a modular FastAPI service with routers, request bodies, query and path parameters, response models and appropriate error responses. It should demonstrate sound HTTP semantics and thin route handlers.
- **Self-check:** Turn the Module 0 utility into a modular HTTP service.

- **Required reading:** [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/), sections "First Steps", "Path Parameters", "Query Parameters", "Request Body", "Response Model", "Handling Errors", "Path Operation Configuration", and "Bigger Applications - Multiple Files".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 3, "Developing a RESTful API with FastAPI", for conceptual explanation only. Build with the current tutorial's APIs.

### 1.2 Data validation with Pydantic

- **Learning outcomes:** Explain how schemas validate, transform, serialise and protect data at application boundaries.
- **Applied exercises:** Build separate request, domain and response models with nested values, enums and custom validation. They should demonstrate that invalid data cannot silently enter or leave the application.
- **Self-check:** Model customers, tickets and extraction results.

- **Required reading:** [Pydantic models](https://docs.pydantic.dev/latest/concepts/models/), [fields](https://docs.pydantic.dev/latest/concepts/fields/), [validators](https://docs.pydantic.dev/latest/concepts/validators/) and [serialization](https://docs.pydantic.dev/latest/concepts/serialization/), alongside FastAPI's response-model tutorial.
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 4, "Managing Pydantic Data Models in FastAPI", for concepts; follow the current Pydantic docs for syntax.

### 1.3 Dependency injection

- **Learning outcomes:** Explain inversion of control and how dependency injection improves substitution, lifecycle management and testability.
- **Applied exercises:** Wire one service, one data source and one external-client wrapper through FastAPI dependencies. Use an in-memory implementation first, override it in an endpoint test, and demonstrate cleanup for a dependency using `yield`. Explain which responsibilities belong in the endpoint and which belong in the service; add the database implementation in 1.4. Start with the in-memory repository from Module 0. The database-backed repository is introduced in 1.4; use the same interface when you swap implementations.
- **Self-check:** Demonstrate dependency substitution and resource cleanup without changing business logic.

- **Required reading:** [FastAPI dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/), [dependencies with `yield`](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/) and [overriding dependencies in tests](https://fastapi.tiangolo.com/advanced/testing-dependencies/).
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 5, "Dependency Injection in FastAPI", for explanation.

### 1.4 Asynchronous persistence and database access

- **Learning outcomes:** Explain async database sessions, transactions, migrations and repository boundaries, including where consistency can fail.
- **Applied exercises:** Add PostgreSQL, async SQLAlchemy, migrations and transactional CRUD operations. It should demonstrate safe session handling, durable state and persistence logic isolated from HTTP concerns.
- **Self-check:** Use PostgreSQL, async SQLAlchemy and migrations.

- **Required reading:** [SQLAlchemy unified tutorial](https://docs.sqlalchemy.org/en/20/tutorial/), [asyncio ORM and `AsyncSession`](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html), [session and transaction basics](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), and the [Alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html).
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 6, "Databases and Asynchronous ORMs", especially SQLAlchemy and Alembic, but adapt commands and snippets to current releases. _Designing Data-Intensive Applications_, 2nd ed., Chapter 3, "Data Models and Query Languages".
- **Technical references:** [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html) for local database basics. Use a separate `AsyncSession` per concurrent task and test transaction rollback.

### 1.5 Authentication and API security

- **Learning outcomes:** Distinguish authentication from authorisation and explain tokens, password handling, CORS, secrets and common API threats.
- **Applied exercises:** Use two demo users to implement password verification, token issuance and protected endpoints following the FastAPI security tutorial. Add an ownership check for one resource: test a missing/invalid token, an owner request and a request by the other authenticated user. Keep secrets outside source code. Registration flows and external identity-provider integration are extensions. Test with two users: each can read their own resource and receives a denial for the other's resource. Do not mistake a valid login for resource-level authorisation.
- **Self-check:** Demonstrate authentication and an independently enforced resource-ownership decision.

- **Required reading:** [FastAPI security tutorial](https://fastapi.tiangolo.com/tutorial/security/), particularly current-user dependencies, password hashing and OAuth2 tokens; [OWASP API Security Top 10](https://api-security.owasp.org/) for broken object-level authorisation and other API risks.
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 7, "Managing Authentication and Security in FastAPI", for concepts only.

### 1.6 Asynchronous API testing

- **Learning outcomes:** Choose between unit and integration tests and explain async fixtures, mocks, dependency overrides and test isolation.
- **Applied exercises:** Build an async test suite covering services, endpoints, database interactions and failure cases. It should demonstrate repeatability, isolated state and confidence in behaviour rather than implementation details.
- **Self-check:** Test dependencies, API errors and database interactions.

- **Required reading:** _Hypermodern Python Tooling_, Chapter 6, "Testing with pytest"; [FastAPI async tests](https://fastapi.tiangolo.com/advanced/async-tests/), [dependency overrides](https://fastapi.tiangolo.com/advanced/testing-dependencies/) and [pytest fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html).
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 11, "Testing Your Code"; _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 9, "Testing an API Asynchronously with pytest and HTTPX", for test-design ideas only. Use the current HTTPX ASGI transport example, not the book's old `AsyncClient(app=...)` form.

### 1.7 Application packaging and deployment

- **Learning outcomes:** Explain the runtime concerns that separate local code from a deployable service, including configuration, containers, processes and health checks.
- **Applied exercises:** Build a container image from the locked `uv` project and run the API against a disposable PostgreSQL instance locally. Supply configuration at runtime, apply a migration deliberately and verify a health endpoint. Record the build and run commands. Actual cloud deployment is taught in Module 8.
- **Self-check:** Run the locked API in a reproducible local container with runtime configuration and migrations.

- **Required reading:** [FastAPI deployment concepts](https://fastapi.tiangolo.com/deployment/concepts/) and [containers](https://fastapi.tiangolo.com/deployment/docker/); [`uv` Docker integration](https://docs.astral.sh/uv/guides/integration/docker/); [Pydantic settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/).
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".

## Module 2: Foundations of AI and large language models

**Module aim:** Build a useful mental model of foundation models, then integrate them safely.

**Module learning outcomes:** Explain the foundation-model concepts that affect application behaviour. These concepts include tokens, embeddings, transformers, generation controls, provider options, multimodal inputs and output constraints.

**Module practical assessment:** Build a provider-agnostic AI service with structured outputs, streaming and deliberate generation controls, plus a small multimodal prototype. Make a provisional hosted/local comparison; formal model-quality evaluation follows in Module 4.

### 2.1 The discipline of AI engineering

- **Learning outcomes:** Distinguish AI engineering from model training and explain the application layers, feedback loops and tradeoffs around a foundation model.
- **Applied exercises:** Create an annotated architecture diagram for one useful AI feature. Identify the user outcome, frontend, API, deterministic business logic, model-provider boundary and data sources. Explain which parts use a foundation model, which use ordinary code, and why the feature is worth building. Reuse the Module 1 API as an example; a new full-stack service is not required.
- **Self-check:** Map a concrete user outcome to the application layers and distinguish AI engineering from model training.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 1, "Introduction to Building AI Applications with Foundation Models".
- **Recommended reading:** _Building LLMs for Production_, Chapter 1, "Introduction to LLMs".

### 2.2 Tokenisation and context limits

- **Learning outcomes:** Explain how tokenisation affects meaning, context limits, latency and cost across different model families.
- **Applied exercises:** Adapt the chapter's tokenizer comparison into a small script or notebook. Compare token IDs, decoded pieces and counts for the same ordinary text, code, punctuation and multilingual text using two tokenizers. Calculate context usage for a stated limit; if adding a cost estimate, use the assigned current provider rates and record the model and date.
- **Self-check:** Compare text segmentation and explain its effect on context usage and a dated cost estimate.

- **Required reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 2, "Understanding LLMs".
- **Technical references:** Use the chosen provider's current tokeniser and pricing pages for any cost estimate; record the model, input/output token rates and date rather than copying an old price from a book.

### 2.3 Embedding representations

- **Learning outcomes:** Explain token versus sentence embeddings, vector dimensionality, and static versus contextual representations. Introduce the idea of semantic similarity; calculate similarity and inspect its limitations in Module 5.
- **Applied exercises:** Generate sentence embeddings for several short texts using the chapter's pretrained embedding-model example. Print the vector dimensions and distinguish one sentence vector from a sequence of token vectors. Explain static versus contextual token representations. Implement numerical similarity and ranking after the geometry and semantic-search lessons in Module 5.
- **Self-check:** Create and inspect embeddings before implementing similarity-based retrieval.

- **Required reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 3, "Analytic Geometry".

### 2.4 Transformer architecture fundamentals

- **Learning outcomes:** Trace a prompt through embeddings, attention blocks, logits and sampling, including the purpose of context and KV caching.
- **Applied exercises:** Adapt the chapter's small pretrained-model example, or create an annotated visual trace if the model cannot run on the available hardware. Follow the prompt through token IDs, embeddings, transformer blocks, final logits and selection of the next token. Explain the role of the KV cache. Use existing model components; implementing attention or training a transformer is not required.
- **Self-check:** Explain the forward pass and next-token selection using observed output or a clearly labelled conceptual diagram.

- **Required reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Chapter 1, "Understanding Large Language Models".
- **Technical references:** [Hugging Face Transformers model outputs](https://huggingface.co/docs/transformers/main_classes/output) and [causal language modelling](https://huggingface.co/docs/transformers/tasks/language_modeling) for a small model's logits; use the book to explain the internal blocks. If the model does not expose a KV cache in the chosen trace, explain that part conceptually.

### 2.5 Model provider APIs and abstractions

- **Learning outcomes:** Explain how model-provider capabilities, limits, errors and usage metadata differ and what a stable abstraction should normalise.
- **Applied exercises:** Build one typed interface with adapters for at least two providers. It should demonstrate provider substitution, consistent errors and normalised usage, latency and response metadata.
- **Self-check:** Place two model providers behind one typed interface.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models".
- **Recommended reading:** _Building LLMs for Production_:
  - Chapter 1, "Introduction to LLMs".
  - Chapter 2, "LLM Architectures and Landscape".
  - Chapter 3, "LLMs in Practice".
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/).

### 2.6 Structured model outputs

- **Learning outcomes:** Distinguish syntactically valid JSON from schema-valid domain data and explain validation, retry and failure-handling strategies.
- **Applied exercises:** Build a structured extraction endpoint whose responses are validated by Pydantic and tested with malformed outputs. It should demonstrate that model text is never trusted before validation.
- **Self-check:** Validate every model response with Pydantic.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 4, "Managing Pydantic Data Models in FastAPI".
- **Technical references:** [OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

### 2.7 Streaming model responses

- **Learning outcomes:** Explain streaming transport choices, partial output, cancellation, backpressure and mid-stream failure handling.
- **Applied exercises:** Stream output from one model through FastAPI and consume it incrementally with HTTPX. Stop the consumer early and close the stream, then simulate an error after some output has arrived. Preserve the visible partial output and report that the response is incomplete rather than silently treating it as success. Automatic resume and a browser frontend are extensions.
- **Self-check:** Demonstrate incremental output, stream cleanup and an explicit incomplete-response error.

- **Required reading:** [OpenAI streaming responses](https://platform.openai.com/docs/guides/streaming-responses) or [Anthropic streaming messages](https://docs.anthropic.com/en/docs/build-with-claude/streaming), plus [FastAPI custom responses](https://fastapi.tiangolo.com/advanced/custom-response/) for `StreamingResponse`.
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 8, "Defining WebSockets for Two-Way Interactive Communication".
- **Technical references:** [HTTPX streaming responses](https://www.python-httpx.org/quickstart/#streaming-responses) for the consumer and cancellation path.

### 2.8 Generation controls and decoding

- **Learning outcomes:** Explain how temperature, top-k, top-p, stop sequences, repetition penalties and random seeds affect model output. Choose settings for a task rather than copying defaults. Explain why a lower temperature does not guarantee factual or deterministic output.
- **Applied exercises:** Choose one extraction prompt and one creative-generation prompt. Repeat each across two or three supported decoding settings, changing one parameter at a time. Record the applied settings, output variation and extraction-schema validity; reuse earlier timing and token-count methods if desired. Explain why low temperature does not guarantee factual or identical output, and mark unsupported controls as unavailable.
- **Self-check:** Make a controlled sampling comparison and describe the limitations of the result.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models", particularly the sampling sections.
- **Recommended reading:**
  - _Build a Large Language Model (From Scratch)_, Chapter 5, section 5.3, "Decoding strategies to control randomness".
  - _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, decoding and sampling sections.
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/) for supported generation parameters.

### 2.9 Hosted, open-weight and local model ecosystems

- **Learning outcomes:** Compare hosted APIs, open-weight models, self-hosted inference and local development with Ollama. Explain how Hugging Face distribution, numerical precision and quantisation affect deployment choices. Select models based on capability, privacy, licence, latency, operational effort and cost.
- **Applied exercises:** Compare the hosted adapters from 2.5 with one locally runnable model using the assigned Ollama guide. Use the same small fixed set of prompts and record model/licence, execution location, observed outputs, latency, token usage and hardware constraints. Give a provisional choice for one use case and explain the privacy and operational tradeoffs. Formal quality benchmarking follows in Module 4; compare only models that can actually run.
- **Self-check:** Make a provisional hosted-versus-local decision from observed behaviour and explicit deployment constraints.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 2 and 9.
- **Recommended reading:**
  - _LLM Engineer's Handbook_, Chapters 8–10.
  - _Hands-On Large Language Models_, model selection and model openness sections.
- **Technical references:** [Hugging Face local applications](https://huggingface.co/docs/hub/local-apps) and [using Hugging Face GGUF models with Ollama](https://huggingface.co/docs/hub/ollama).

### 2.10 Multimodal models for images and documents

- **Learning outcomes:** Explain how multimodal models represent and process text, images and documents. Distinguish image understanding from image generation. Explain how image resolution and quantity affect context usage and cost. Compare OCR, layout extraction and native multimodal processing. Identify failures involving diagrams, small text, tables and spatial relationships.
- **Applied exercises:** Build a small notebook or script that asks questions about two supplied images using a multimodal model. Compare a text-only prompt with a text-plus-image prompt and record a correct observation, a missed detail and an uncertain answer. Reuse Pydantic to return an image ID, extracted fields and a limitations note. PDF parsing, OCR pipelines and page-level citation verification are extensions after the selected provider's document-processing guide.
- **Self-check:** Compare image-conditioned and text-only behaviour and record concrete visual failure cases.

- **Required reading:** _Hands-On Large Language Models_, Chapter 9, "Multimodal Large Language Models".
- **Recommended reading:**
  - _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 16, "Vision and Multimodal Transformers".
  - _Generative Deep Learning_, Chapter 13, "Multimodal Models".
  - _AI Engineering: Building Applications with Foundation Models_, Chapter 6, particularly "RAG Beyond Texts".
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/) for image inputs and document processing.

### 2.11 Speech and audio applications (extension)

This extension covers an area that the supplied books do not explore deeply.

- **Learning outcomes:** Explain the basic architecture of speech-to-text, text-to-speech and speech-to-speech systems. Handle audio formats, sampling rates, transcription, speaker turns, streaming, latency and interruption. Include consent, privacy and audio-specific evaluation in the design.
- **Applied exercises:** Adapt the Audio Course's preprocessing and ASR examples to transcribe two short, consented or synthetic audio files. Record the input sampling rate, any resampling, model and transcript, and inspect one transcription error. Preserve the transcript separately from an optional structured summary using 2.6. Add timestamps only if the chosen ASR method teaches and supports them; a TTS example from Unit 6 is optional.
- **Self-check:** Demonstrate audio preprocessing and transcription without assuming every ASR model produces timestamps or speaker labels.

- **Required reading:** [Hugging Face Audio Course](https://huggingface.co/learn/audio-course/chapter0/introduction), Units 2, 5, 6 and 7.

## Module 3: Prompt and context engineering

**Module aim:** Design controlled application steps instead of relying on clever prompt strings.

**Module learning outcomes:** Design prompts and context as testable application components. Explain context selection, budgeting, provenance, compaction, isolation, decomposition, verification and trust boundaries.

**Module practical assessment:** Build a deterministic multi-stage AI workflow with managed context, structured intermediate results and verification. The workflow should remain reliable as its context grows.

### 3.1 LLM application architecture

- **Learning outcomes:** Separate deterministic application logic from probabilistic model work and explain the boundaries between user, model and domain representations.
- **Applied exercises:** Build a workflow that transforms user input into a model-ready request and converts the result back into a domain object. It should demonstrate explicit boundaries and keep business rules outside prompts.
- **Self-check:** Separate the user problem, model domain and returned result.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 4, "Designing LLM Applications".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 1, "Introduction to Building AI Applications with Foundation Models".

### 3.2 Prompt content and context sources

- **Learning outcomes:** Explain how static instructions, examples, retrieved evidence and dynamic data influence model behaviour and consume the context budget.
- **Applied exercises:** Use 10-20 fixed inputs and a simple manual rubric. Compare a baseline prompt with variants that add explicit instructions, a few-shot example and a supplied evidence snippet, one at a time. Keep the model and decoding settings fixed, record token use and inspect output differences. Supply the evidence directly rather than building a retriever at this stage.
- **Self-check:** Measure the contribution of each prompt-content type on the same examples.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".

### 3.3 Prompt structure and instruction hierarchy

- **Learning outcomes:** Explain how hierarchy, delimiters, ordering and instruction precedence make prompts easier to maintain and test.
- **Applied exercises:** Build a reusable prompt assembler with named instruction, example, evidence and user-input sections. Compare two section orders on the lesson 3.2 examples and inspect the assembled text. Keep data clearly labelled and separate from instructions, and save a versioned template. Explain that delimiters improve structure but do not enforce a security boundary.
- **Self-check:** Demonstrate prompt structure and ordering without treating formatting as an injection defence.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 6, "Assembling the Prompt".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 5, "Prompt Engineering".

### 3.4 Task decomposition and verification

- **Learning outcomes:** Identify when a task should be split into controlled stages and explain how intermediate validation reduces compound failures.
- **Applied exercises:** Build one task in both single-call and multi-stage forms. Compare both on the same small fixed example set from lesson 3.2, recording intermediate validation failures and outcomes with a simple rubric. Formal metrics and regression gates come in Module 4.
- **Self-check:** Compare one large call with several controlled steps.

- **Required reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content"; Chapter 6, "Assembling the Prompt"; Chapter 7, "Taming the Model".

### 3.5 Prompt injection and trust boundaries

- **Learning outcomes:** Explain prompt-injection threat models, trust boundaries and the limitations of prompt-only defences.
- **Applied exercises:** Create direct and indirect injection examples for the Module 3 workflow, using a supplied untrusted text snippet rather than a live RAG system. Compare a baseline prompt with a defensive prompt and record which attacks still succeed. Enforce one allow/deny rule in application code and test that rule independently of model output. Do not treat a passing sample as proof that injection is impossible.
- **Self-check:** Distinguish measured prompt resistance from a permission rule enforced by code.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 5, "Prompt Engineering".
- **Recommended reading:** _Building LLMs for Production_, Chapter 4, "Introduction to Prompting".
- **Technical references:** [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/).

### 3.6 Context selection, assembly and budgeting

- **Learning outcomes:** Explain that context includes instructions, conversation history, retrieved evidence, tool definitions, intermediate results and application state. Decide what enters the context, where it appears, and what must stay excluded. Assign token budgets, trust levels and provenance to each source. Retrieve information only when the task needs it.
- **Applied exercises:** Build a context assembler from small fixture records: instructions, conversation turns, supplied evidence, sample tool descriptions and task facts. Assign priorities and token counts, reserve output capacity, and include elements only while they fit the budget. Remove duplicate evidence, retain source IDs and list exclusions with reasons. Use fixtures for retrieval and tools, which are implemented in later modules.
- **Self-check:** Show which context elements survive a fixed token budget and why.

- **Required reading:**
  - _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content".
  - _Prompt Engineering for LLMs_, Chapter 6, "Assembling the Prompt".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 5 and 6.
- **Technical references:** [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
- **Further reading:** _Hands-On Context Engineering_ by Xinye Tang and Wei Sun.

### 3.7 Long-context management, compaction and isolation

- **Learning outcomes:** Diagnose lost information, conflicting instructions, oversized tool results, destructive summaries and cross-task contamination. Compare truncation, summarisation, retrieval, durable memory, task isolation and external state. Explain how long contexts increase latency and cost.
- **Applied exercises:** Compare a full conversation, a truncated conversation and a compacted summary on a small fact-recall task. Move a key fact between the beginning, middle and end of the input, and record accuracy and token use without assuming a long-context failure must occur. Save essential task facts and decisions in a local note, restore them in a fresh model conversation, and show that two independent tasks use separate contexts. Durable workflow execution is outside this exercise.
- **Self-check:** Measure information retained by compaction, external notes and task isolation.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:**
  - _Prompt Engineering for LLMs_, Chapter 5, dynamic context and summarisation.
  - _Hands-On Large Language Models_, long-context limitations and generation sections.
- **Technical references:**
  - [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
  - [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
  - [How Anthropic built its multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system).

## Module 4: Evaluation of AI systems

**Module aim:** Make quality measurable before adding retrieval, tools or agent autonomy.

**Module learning outcomes:** Explain how evaluation datasets, deterministic checks, model judges, slicing and regression thresholds turn subjective model behaviour into measurable evidence.

**Module practical assessment:** Build a reusable evaluation harness with a versioned golden set, deterministic assertions, rubric-based judging and model comparisons. It should demonstrate repeatable quality measurement suitable for CI.

### 4.1 Evaluation methodology

- **Learning outcomes:** Define measurable success criteria and explain offline evaluation, online signals, error analysis and evaluation slices.
- **Applied exercises:** Write an evaluation specification for the Module 3 workflow. Define success for one objectively checkable requirement and one subjective requirement; select an exact check for the first and a human rubric for the second. Include a passing and failing example for each, plus limitations of the chosen measures. Dataset construction and a reusable evaluator follow in the next lessons.
- **Self-check:** Choose evaluation methods that fit the property being measured.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 3, "Evaluation Methodology".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".

### 4.2 Evaluation dataset design

- **Learning outcomes:** Explain how representativeness, annotation quality, metadata, leakage and slicing affect the credibility of an evaluation set.
- **Applied exercises:** Build and version a curated golden dataset with normal, difficult and adversarial examples plus useful metadata. It should demonstrate coverage of meaningful user and failure scenarios.
- **Self-check:** Create a curated golden set with failure categories.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

### 4.3 Deterministic evaluation methods

- **Learning outcomes:** Recognise outputs that ordinary program logic can evaluate and explain why deterministic checks should be preferred when available.
- **Applied exercises:** Implement deterministic checks for three properties of the chosen task, such as schema validity, a required identifier and a calculation or business rule. Include correct outputs, malformed outputs and subtle failures. Distinguish exact equality from legitimate alternative wording; use ordinary code only for properties that code can actually decide.
- **Self-check:** Demonstrate reliable objective checks without claiming to automatically judge all factual or semantic correctness.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 6, "Model Development and Offline Evaluation".

### 4.4 Model-based evaluation

- **Learning outcomes:** Explain the strengths, biases and failure modes of LLM judges, including rubric design, calibration and structured scoring.
- **Applied exercises:** Build a rubric-based judge with structured scores for one task. Score a small human-labelled subset of the 4.2 dataset and report simple agreement plus examples of disagreement. Swap candidate-response order in a pairwise comparison to probe positional bias. Keep rubric, model and settings fixed, and identify cases requiring human review.
- **Self-check:** Compare judge scores with human labels and inspect a concrete judge bias.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 3, "Evaluation Methodology".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

### 4.5 Comparative model evaluation and selection

- **Learning outcomes:** Compare models as a multi-objective decision across quality, latency, cost, context and structured-output reliability.
- **Applied exercises:** Build a benchmark that runs the same dataset across multiple models and produces a comparison report. It should demonstrate an evidence-based model choice rather than preference or benchmark reputation alone.
- **Self-check:** Compare quality, latency, cost and output reliability.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".

### 4.6 Regression evaluation

- **Learning outcomes:** Explain how versioned datasets, baselines, thresholds and CI gates detect quality regressions across application changes.
- **Applied exercises:** Create a local regression-evaluation command that runs the same versioned cases against a baseline and a changed prompt or model. Save per-case results and flag changes that exceed a stated quality threshold. Demonstrate one detected regression and document how a reviewed baseline is updated. Connect the command to CI in lesson 8.3.
- **Self-check:** Demonstrate a repeatable local regression check before adding CI automation.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".

## Module 5: Information retrieval and retrieval-augmented generation

**Module aim:** Build retrieval as an engineered system, not a vector-database demo.

**Module learning outcomes:** Explain every layer of a RAG system and diagnose whether failures originate in ingestion, chunking, retrieval, reranking or generation.

**Module practical assessment:** Build a locally runnable RAG product with traceable ingestion, hybrid retrieval, reranking, grounded citations and separate retrieval and generation evaluations. It should demonstrate measurable relevance and faithfulness. Deploy it in Module 8.

### 5.1 Embedding geometry

- **Learning outcomes:** Explain vectors, norms, distance and cosine similarity well enough to reason about embedding-based retrieval behaviour.
- **Applied exercises:** Use a few hand-written two-dimensional vectors to calculate Euclidean norm, distance, dot product and cosine similarity from the assigned geometry sections. Plot them and show how rescaling a nonzero vector changes its norm but not its cosine with another vector. Handle the zero-vector case explicitly. Then inspect a real sentence-embedding vector from 2.3, separating geometric calculations from claims about semantic relevance.
- **Self-check:** Verify vector calculations on toy examples before interpreting real embedding similarities.

- **Required reading:** _Mathematics for Machine Learning_, Chapter 3, sections 3.1 "Norms", 3.2 "Inner Products", 3.3 "Lengths and Distances", and 3.4 "Angles and Orthogonality". These sections are required for the numerical geometry exercise.
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings"; _Mathematics for Machine Learning_, Chapter 2, "Linear Algebra", for background on vectors.

### 5.2 Semantic search

- **Learning outcomes:** Explain the dense-retrieval pipeline and how relevance judgements, precision, average precision and mean average precision reveal retrieval and ranking failures.
- **Applied exercises:** Build a dense semantic-search baseline over a small fixed corpus with labelled queries and relevant document IDs. Calculate precision at chosen ranks, average precision per query and mean average precision using the chapter's worked method. Inspect one relevant result ranked poorly and one misleading result ranked highly. Reuse the same labels in later retrieval comparisons.
- **Self-check:** Measure the dense-search baseline with the precision and MAP metrics taught in the chapter.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Technical references:** [Sentence Transformers semantic search](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html).

### 5.3 Retrieval ingestion pipelines

- **Learning outcomes:** Explain the stages of a reliable ingestion pipeline, including cleaning, metadata, provenance, idempotency and reprocessing.
- **Applied exercises:** Implement the chapter's extract-clean-chunk-embed-load sequence on a small document collection. Keep source/document IDs and metadata on the outputs, use stable chunk IDs for deduplication, and demonstrate that re-ingesting unchanged content does not add duplicate records. Show one rejected input with an identifiable error. Full checkpointed orchestration and recovery after arbitrary interruptions are extensions.
- **Self-check:** Demonstrate ingestion stages, provenance and safe re-ingestion of unchanged content.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Building LLMs for Production_, Chapter 8, "Indexes, Retrievers, and Data Preparation".

### 5.4 Document chunking strategies

- **Learning outcomes:** Explain how chunk size, overlap and document structure affect retrieval relevance and context quality. Assess their effect on answer citations after lesson 5.9.
- **Applied exercises:** Compare fixed-token chunks with the chapter's paragraph-first, token-limited splitting on the same documents and query labels from 5.2. Vary chunk size and one overlap setting, inspect boundaries and compare retrieval MAP. Record document/chunk IDs, but defer answer-citation scoring until generation is added in 5.9. Heading-aware, recursive and semantic splitting are optional after their library documentation.
- **Self-check:** Measure how chunk boundaries, size and overlap affect retrieval before evaluating answer citations.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Building LLMs for Production_, Chapter 8, "Indexes, Retrievers, and Data Preparation".
- **Technical references:** [LlamaIndex node parsers](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/) and [semantic splitter reference](https://docs.llamaindex.ai/en/stable/api_reference/node_parsers/semantic_splitter/) if implementing those extension strategies.

### 5.5 Vector databases and indexes

- **Learning outcomes:** Explain vector indexing, approximate nearest-neighbour search, metadata filtering and the tradeoffs of common vector stores.
- **Applied exercises:** Build a vector index with either PostgreSQL and pgvector or Qdrant, including metadata filters and index configuration. It should demonstrate correct persistence, filtered retrieval and understanding of recall-latency tradeoffs.
- **Self-check:** Use PostgreSQL with pgvector or Qdrant.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Technical references:** [pgvector](https://github.com/pgvector/pgvector) or [Qdrant documentation](https://qdrant.tech/documentation/).

### 5.6 Full-text and lexical retrieval

- **Learning outcomes:** Explain lexical retrieval and BM25, including why exact terms can outperform semantic similarity for some queries.
- **Applied exercises:** Build a BM25 or database full-text baseline over the same corpus. It should demonstrate strong handling of identifiers, names and exact terminology, with metrics comparable to dense retrieval.
- **Self-check:** Implement BM25 or full-text search as a baseline.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 4, "Storage and Retrieval".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Technical references:** [PostgreSQL full-text search](https://www.postgresql.org/docs/current/textsearch.html) or [Elasticsearch BM25](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html).

### 5.7 Hybrid retrieval

- **Learning outcomes:** Explain score and rank fusion strategies and why combining lexical and semantic retrieval can improve coverage.
- **Applied exercises:** Combine the lexical baseline from 5.6 with the dense baseline from 5.2 using one fusion strategy described in the assigned chapter. Explain how scores or ranks are combined. Compare all three retrievers on the same corpus, queries and MAP calculation; report improvements, regressions and unchanged cases, and justify whether to retain the hybrid stage.
- **Self-check:** Evaluate a documented fusion strategy without requiring it to outperform both baselines.

- **Required reading:** _Building LLMs for Production_, Chapter 9, "Advanced RAG".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 9, "RAG Inference Pipeline".

### 5.8 Retrieval reranking

- **Learning outcomes:** Explain the role of rerankers, the difference between bi-encoders and cross-encoders, and their latency-quality tradeoff.
- **Applied exercises:** Add a cross-encoder reranker to the existing retriever using the assigned retrieve-and-rerank example. Keep candidate count and final result count explicit, then compare MAP and measured latency before and after on the same labelled queries. Inspect changed rankings and decide whether the quality change justifies the extra stage, including when it does not.
- **Self-check:** Measure the reranker's relevance and latency tradeoff rather than assuming a quality improvement.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 9, "RAG Inference Pipeline".
- **Technical references:** [Sentence Transformers retrieve and rerank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html).

### 5.9 Grounded generation and citations

- **Learning outcomes:** Explain grounded generation, faithfulness, citation alignment and when a system should refuse to answer.
- **Applied exercises:** Generate answers from retrieved documents that have stable source IDs. Ask for document-level citations, verify that returned IDs exist in the supplied context, and manually check whether each cited document supports its associated claim. Include an unsupported question and request an explicit insufficient-evidence response, recording any failure to abstain. Exact passage offsets and guaranteed refusal are not required.
- **Self-check:** Inspect grounded answers and document-level citation support without claiming guaranteed abstention.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".

### 5.10 RAG evaluation

- **Learning outcomes:** Separate retrieval quality from generation quality and explain the metrics needed to diagnose each layer independently.
- **Applied exercises:** Evaluate the same RAG cases in two reports: retrieval MAP from 5.2, and generation fluency, usefulness, faithfulness, answer relevance, citation precision and citation recall from the assigned chapter. Use the Module 4 rubric/judge workflow and manually inspect disagreements. Identify cases with good retrieval but poor answers, and cases with missing evidence; propose the component to change. Recall@k and MRR are optional after reading their definitions.
- **Self-check:** Separate retrieval ranking failures from grounding, answer-quality and citation failures.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

## Module 6: Tool-using AI systems and agents

**Module aim:** Understand tools, control loops and state before adding agent complexity.

**Module learning outcomes:** Explain tool calling, agent loops, workflow state, memory, failure recovery and secure MCP integration. Choose between deterministic workflows and autonomous agents.

**Module practical assessment:** Build an auditable business automation with narrow tools, explicit task state, bounded retries and simulated human approval. Implement a constrained read-only MCP server. Durable execution and advanced framework features are extensions requiring their specific implementation guides.

### 6.1 Tool and function calling

- **Learning outcomes:** Explain tool schemas, model-selected arguments, validation and the security boundary between model intent and code execution.
- **Applied exercises:** Build one safe, read-only tool with a narrow schema, server-side validation and structured results. It should demonstrate that model-generated arguments are treated as untrusted input.
- **Self-check:** Give a model one safe, schema-driven tool.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** _Building LLMs for Production_, Chapter 10, "Agents".
- **Technical references:** [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling) and [Anthropic tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview).

### 6.2 Tool interface design

- **Learning outcomes:** Explain how tool granularity, descriptions, idempotency and predictable outputs affect an agent’s reliability.
- **Applied exercises:** Define two or three narrow read-only tools with explicit names, descriptions, argument schemas and predictable result formats. Give the model tasks where only one tool is appropriate, then inspect its selection and arguments. Include an unknown tool and invalid argument in application-level tests. Compare with one overly broad tool description; state-changing retry semantics are not required here.
- **Self-check:** Test how tool names, descriptions and schemas affect correct tool selection.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/).

### 6.3 Agent control-loop implementation

- **Learning outcomes:** Explain every step of a model-tool-result loop, including termination conditions, context updates and repeated calls.
- **Applied exercises:** Implement the agent loop directly without a framework, including validation, maximum steps and trace capture. It should demonstrate understanding of the control flow that frameworks later abstract.
- **Self-check:** Implement the model-tool-result loop yourself.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 7, "Advanced Text Generation Techniques and Tools".

### 6.4 Workflow and agent architectures

- **Learning outcomes:** Distinguish deterministic workflows from autonomous agents and justify the simplest orchestration that satisfies the task.
- **Applied exercises:** Implement a fixed two- or three-stage workflow and compare it with the manual agent loop from 6.3 on the same small set of business tasks using read-only tools. Record task success, steps, latency and token use. Explain whether variable tool choice helps enough to justify autonomy; do not require either approach to win.
- **Self-check:** Choose orchestration from observed reliability, cost and flexibility.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".

### 6.5 Workflow state management

- **Learning outcomes:** Explain explicit work-item state, task inputs and outputs, branching and bounded retries. Distinguish application state from conversation context; treat durable execution as a separate implementation topic.
- **Applied exercises:** Represent the workflow's work item as explicit typed state containing the original input, intermediate outputs, current stage and attempt count. Pass that state between two tasks, add a success/failure branch, and show that a bounded retry retains the original inputs and terminates when its limit is reached. Draw the state transitions. Crash recovery and exactly-once side effects are not required by this reading.
- **Self-check:** Demonstrate explicit state, branching and bounded retries in one process.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 7, "Advanced Text Generation Techniques and Tools".

### 6.6 Agent planning and memory

- **Learning outcomes:** Distinguish working context, durable memory, retrieved knowledge and plans, including their lifecycle and privacy implications.
- **Applied exercises:** Generate a short plan for a read-only task, record the actual tool steps, and compare the plan with what happened. Keep current-task facts in context and reusable notes in a separate local store. Run a second task with and without retrieval of a relevant note, then delete that note and show it is no longer retrieved. Use synthetic information; a production user-memory or expiry-policy system is an extension.
- **Self-check:** Show how planning, transient context and retrieved long-term notes serve different purposes.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency"; Chapter 9, "LLM Workflows".

### 6.7 Agent reliability and human oversight

- **Learning outcomes:** Classify planning, tool and efficiency failures, and explain how validation, timeouts, maximum steps and human approval constrain them. Distinguish these controls from distributed idempotency and compensating transactions.
- **Applied exercises:** Create cases for an unknown tool, a valid tool with invalid arguments, a tool returning an incorrect result, and a plan that misses a stated constraint. Use the earlier timeout and maximum-step controls to stop stalled or runaway runs. Record failure category, tool-call validity, task success, steps and latency. For one simulated write action, require a code-enforced approval decision before execution, reusing the tool-approval guidance in the Chapter 8 reading from 6.1. Compensation and distributed duplicate-execution guarantees are extensions.
- **Self-check:** Classify planning, tool and efficiency failures and demonstrate a controlled stop or escalation.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 11, "The Human Side of Machine Learning".

### 6.8 MCP architecture and capability model

- **Learning outcomes:** Explain the roles of MCP hosts, clients and servers across local and remote connections. Describe tools, resources, prompts, capability discovery, request lifecycles, notifications, subscriptions and security boundaries. Contrast MCP with ordinary model function calling.
- **Applied exercises:** Create an annotated MCP interaction transcript from the current specification examples. Identify the host, client and server; show discovery plus one resource read, prompt retrieval and tool call, and explain the control and trust boundary of each. Distinguish protocol-defined messages from host approval behaviour and note which capabilities are optional. Implement the server in 6.9 rather than requiring SDK knowledge in this architecture lesson.
- **Self-check:** Explain MCP roles and messages before implementing a server.

- **Required reading:**
  - [MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro).
  - [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture).
  - [Current MCP specification](https://modelcontextprotocol.io/specification/latest).
- **Recommended reading:**
  - _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, "Model Context Protocol" section.
  - [MCP 2026-07-28 specification release](https://blog.modelcontextprotocol.io/posts/2026-07-28/).
- **Reading guidance:** Treat the current specification as authoritative when an older book or guide describes the previous initialisation and session model.

### 6.9 MCP implementation, authorisation and security

- **Learning outcomes:** Apply input validation, authentication, authorisation, user consent, allowlists and least-privilege access to MCP integrations. Explain local and remote trust boundaries. Handle timeouts, cancellation, audit logging, untrusted servers, credentials and sensitive resources.
- **Applied exercises:** Implement the assigned MCP server tutorial with two narrow read-only tools, connect it to a host, and inspect a successful call, invalid arguments and an unavailable tool. Restrict accessible inputs/resources and keep protocol output separate from logs. Document the local process trust boundary. If choosing remote HTTP transport, also implement the assigned authorisation guide and test a missing/invalid credential; do not pretend a local stdio connection uses the same OAuth flow. Demonstrate that the host, not a prompt, decides whether an action is approved.
- **Self-check:** Build and test a constrained MCP server with security controls appropriate to its transport.

- **Required reading:**
  - [Official MCP server tutorial](https://modelcontextprotocol.io/docs/develop/build-server).
  - [Current MCP specification](https://modelcontextprotocol.io/specification/latest).
- **Technical references:**
  - [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices).
  - [MCP authorisation guide](https://modelcontextprotocol.io/docs/tutorials/security/authorization).
- **Further reading:** _Learn Model Context Protocol with Python_ by Christoffer Noring.

### 6.10 Agent frameworks

- **Learning outcomes:** Explain the state, node, edge and execution abstractions provided by an agent framework and what they replace.
- **Applied exercises:** Build the overview's small `StateGraph`, then replace its mock node with one existing workflow function from 6.4 or 6.5. Define typed state, nodes and start/end edges, invoke it with a fixed input, and compare its result with the manual workflow. Explain what the framework manages. A full agent loop, persistence and human-in-the-loop interrupts are extensions after their specific framework guides.
- **Self-check:** Demonstrate graph state, nodes, edges and invocation before adopting advanced framework features.

- **Required reading:** [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview).
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Technical references:** [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview).

## Module 7: Data engineering and system design

**Module aim:** Move from AI demo development toward resilient software engineering.

**Module learning outcomes:** Reason about AI products as distributed data systems with explicit reliability, scalability, compatibility, storage and processing requirements.

**Module practical assessment:** Extend a portfolio project with documented nonfunctional requirements, evolvable schemas, background work and a recoverable data pipeline. It should demonstrate senior-level system-design tradeoffs.

### 7.1 Non-functional requirements

- **Learning outcomes:** Translate product expectations into measurable latency, reliability, scalability, maintainability and evolvability requirements.
- **Applied exercises:** Build an architecture requirements document with service-level targets and verify one latency target with a small load test and one recovery target with a controlled failure. It should demonstrate that architecture choices follow measurable constraints.
- **Self-check:** Specify latency, reliability, scalability and maintainability.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 2, "Defining Nonfunctional Requirements".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 2, "Introduction to Machine Learning Systems Design".
- **Technical references:** [k6 HTTP load testing](https://grafana.com/docs/k6/latest/using-k6/http-requests/) for the small load-test exercise.

### 7.2 Data modelling

- **Learning outcomes:** Compare relational, document and event-oriented models and choose between them from access patterns and consistency needs.
- **Applied exercises:** Build and justify the data model for the RAG or agent project, including entities, relationships, constraints and access patterns. It should demonstrate deliberate modelling rather than storage chosen by familiarity.
- **Self-check:** Choose models based on access patterns and constraints.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 3, "Data Models and Query Languages".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".

### 7.3 Indexing and storage systems

- **Learning outcomes:** Explain how primary, secondary, full-text and vector indexes accelerate reads while adding storage and write costs.
- **Applied exercises:** Add and benchmark indexes for the project’s main transactional and retrieval queries. It should demonstrate query-plan interpretation and evidence-based indexing decisions.
- **Self-check:** Explain the indexes behind application and retrieval queries.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 4, "Storage and Retrieval".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Technical references:** [PostgreSQL `EXPLAIN`](https://www.postgresql.org/docs/current/using-explain.html) and the chosen vector store's index guide, such as [pgvector](https://github.com/pgvector/pgvector), before interpreting query plans.

### 7.4 API and schema evolution

- **Learning outcomes:** Explain backward and forward compatibility, schema versioning and safe rollout strategies for APIs and stored data.
- **Applied exercises:** Create old and new request/response schema versions for a small API change, such as adding an optional field or renaming one through a compatibility adapter. Run a local matrix of old/new clients against old/new representations and document forward and backward compatibility. Use Alembic for an additive stored-data change if needed. Describe the expand-migrate-contract sequence; a live distributed rollout is not required.
- **Self-check:** Demonstrate schema compatibility with an old/new client matrix before a production rollout.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 5, "Encoding and Evolution".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed.:
  - Chapter 3, "Developing a RESTful API with FastAPI".
  - Chapter 4, "Managing Pydantic Data Models in FastAPI".
- **Technical references:** [Alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html) and [FastAPI response models](https://fastapi.tiangolo.com/tutorial/response-model/) for the migration and old/new API representations.

### 7.5 Batch and background processing

- **Learning outcomes:** Explain queues, workers, retries, scheduling and idempotency for work that should not run inside a request-response cycle.
- **Applied exercises:** Move one existing ingestion or evaluation batch into a Celery task. Submit it outside the request path, observe its task state, and compare its output with the synchronous version. Inject one transient error and demonstrate a bounded retry, then a permanent failure visible through the result backend. Reuse stable IDs or a database uniqueness rule so rerunning the same task does not duplicate output. A custom failure queue and arbitrary crash-recovery guarantees are extensions.
- **Self-check:** Demonstrate background execution, bounded retries, inspectable failure and safe reruns.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 11, "Batch Processing"; [Celery getting started](https://docs.celeryq.dev/en/stable/getting-started/), [tasks and retries](https://docs.celeryq.dev/en/stable/userguide/tasks.html), and [routing](https://docs.celeryq.dev/en/stable/userguide/routing.html).
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 14, "Creating a Distributed Text-to-Image AI System". A failure queue/store is an application design choice; do not assume Celery creates a dead-letter queue automatically.

### 7.6 Stream and event processing

- **Learning outcomes:** Explain event time, ordering, delivery guarantees and consumer state at a practical system-design level.
- **Applied exercises:** Model a small event stream as an append-only sequence with event IDs, entity IDs, versions and event timestamps. Write a consumer that updates a local projection, then replay a duplicate and an older event and explain the chosen deduplication/order policy. Track a consumer offset and replay into a fresh projection. State the assumed delivery semantics; deploying Kafka or another broker is not required.
- **Self-check:** Demonstrate ordering, duplicate handling and replay in a self-contained event-consumer simulation.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 12, "Stream Processing".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".

### 7.7 Data pipeline architecture

- **Learning outcomes:** Explain lineage, orchestration, validation, recovery and observability across a multi-stage data pipeline.
- **Applied exercises:** Build an extract-transform-load script for two small input sources. Validate records during extraction, quarantine rejected records with a reason, then deduplicate, normalise and load accepted records into a file or database. Keep source IDs and input/output counts for each stage. Correct one rejected record and rerun the script using the safe-rerun approach from 7.5. A workflow orchestrator and checkpoint-level replay are extensions.
- **Self-check:** Demonstrate ETL, validation and traceable rejected data without requiring an unassigned orchestrator.

- **Required reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 3, "Data Engineering"; Chapter 4, "RAG Feature Pipeline".

## Module 8: Production AI engineering and LLM operations

**Module aim:** Make one strong project reliable, observable, secure, responsible and economical.

**Module learning outcomes:** Explain the operational controls required to run AI workloads reliably and economically. Assess responsible-AI concerns and test AI-specific security risks.

**Module practical assessment:** Harden the strongest project with deployment, telemetry, cost controls, guardrails and feedback capture. Add responsible-AI controls and automated security regression tests.

### 8.1 Containerised application delivery

- **Learning outcomes:** Explain image layers, build reproducibility, runtime configuration and the security boundary created by a container.
- **Applied exercises:** Build small, non-root production images for the API and worker with reproducible dependencies. They should demonstrate secure defaults, fast rebuilds and environment-independent execution.
- **Self-check:** Create small, reproducible runtime images.

- **Required reading:** [Dockerfile concepts](https://docs.docker.com/build/concepts/dockerfile/), [multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [FastAPI containers](https://fastapi.tiangolo.com/deployment/docker/) and [`uv` Docker integration](https://docs.astral.sh/uv/guides/integration/docker/).
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps". Reuse and harden the local container built in lesson 1.7.

### 8.2 Cloud deployment architectures

- **Learning outcomes:** Compare real-time, asynchronous and batch deployment patterns and explain their scaling, networking and operational tradeoffs.
- **Applied exercises:** Deploy the system’s API, worker and data dependencies using appropriate managed services. It should demonstrate secure networking, independent scaling and a documented deployment topology.
- **Self-check:** Deploy real-time and asynchronous workloads.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 10, "Inference Pipeline Deployment".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 7, "Model Deployment and Prediction Service"; Chapter 10, "Infrastructure and Tooling for MLOps".
- **Technical references:** Before choosing services or running commands, read the chosen platform's current guides for web services, background workers, managed PostgreSQL, private networking and secret injection. If managed deployment is unavailable, document the topology and validate the API-worker-database flow locally without claiming a cloud deployment.

### 8.3 Continuous integration and delivery

- **Learning outcomes:** Explain how tests, evaluations, artefacts, environments, rollout strategies and rollback controls form a safe delivery pipeline.
- **Applied exercises:** Adapt the chapter's GitHub Actions pipeline to the locked `uv` project. Run linting, tests, the local regression command from 4.6 and an image build on a pull request. Introduce a failing test or evaluation to demonstrate a blocked quality gate, then fix it. Add deployment to the isolated environment from 8.2, using that platform's documented commands and versioned images. Rehearse rollback only after its platform-specific guide; CI/CD does not require a new training pipeline.
- **Self-check:** Demonstrate an automated quality gate and a versioned deployment using already learned components.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".
- **Technical references:** [GitHub Actions documentation](https://docs.github.com/en/actions).

### 8.4 Structured application logging

- **Learning outcomes:** Explain structured logging, severity, correlation identifiers and how to avoid leaking sensitive data.
- **Applied exercises:** Add consistent request/job IDs and log levels to one API path and its background task. Log a small allowlist of structured fields such as operation, duration and error category, using the cookbook's contextual logging techniques. Verify that synthetic credentials and personal text are omitted or explicitly masked. Correlate one failure across the two log records; automatic detection of arbitrary PII is not required.
- **Self-check:** Show useful correlated logs and verify the handling of known synthetic sensitive fields.

- **Required reading:** [Python logging cookbook](https://docs.python.org/3/howto/logging-cookbook.html) for structured and contextual logging, and [OpenTelemetry log concepts](https://opentelemetry.io/docs/concepts/signals/logs/) for correlation across signals.
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback". Use synthetic sensitive values in redaction tests rather than real credentials or personal data.

### 8.5 Distributed tracing and observability

- **Learning outcomes:** Explain how metrics, logs and traces work together to diagnose model, retrieval, tool and infrastructure behaviour.
- **Applied exercises:** Instrument one existing request path with spans for retrieval and the model call, and attach model name, token counts and error status when available. Add request-count and duration metrics using the assigned telemetry documentation. Inspect a trace and the corresponding metric change for a deliberately slow or failed request. A complete multi-service dashboard for every tool and cost dimension is an extension.
- **Self-check:** Use one trace and a few metrics to locate a concrete latency or error source.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 8, "Data Distribution Shifts and Monitoring".
- **Technical references:** [OpenTelemetry documentation](https://opentelemetry.io/docs/) and [Prometheus documentation](https://prometheus.io/docs/introduction/overview/).

### 8.6 Performance and cost engineering

- **Learning outcomes:** Identify the main latency and cost drivers in an AI request and explain which optimisation lever addresses each one.
- **Applied exercises:** Benchmark one fixed workload, recording request latency, input/output token usage, quality and a dated cost estimate. Choose one optimisation explained in Chapter 9, such as a smaller model, shorter prompt or output limit, and repeat the workload. Report the observed quality, latency and cost changes, including regressions or no improvement. Explain which bottleneck the change was intended to address.
- **Self-check:** Measure a specific inference optimisation without assuming it improves every metric.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems"; Chapter 9, "Inference Optimization".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".

### 8.7 Caching and model routing

- **Learning outcomes:** Explain cache keys, invalidation, semantic caching and capability-based model routing, including their correctness risks.
- **Applied exercises:** Implement an exact-match response cache for one eligible synthetic task, with a key containing user scope, model, prompt version and input, plus explicit expiry or invalidation. Test a hit, miss, version change and cross-user lookup. Add a simple capability-based rule choosing between the provider adapters from 2.5, and report observed routing choices and cache-hit latency. Semantic caching and learned routing are extensions.
- **Self-check:** Demonstrate cache correctness and explicit model routing before adding semantic or learned policies.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".

### 8.8 Responsible AI, privacy and fairness

- **Learning outcomes:** Explain how bias, privacy, explainability, accessibility and human oversight affect AI products. Identify people who may be harmed and recognise representation or measurement bias. Define acceptable and unacceptable uses. Minimise personal data, select evaluation criteria, require human review where needed and communicate limitations.
- **Applied exercises:** Create a risk assessment listing affected people, intended use, foreseeable misuse and measurement limits. Implement three small controls using earlier skills: a human-review gate for an identified risky action, an explicit consent/data-use boundary for stored examples, and an evaluation comparison across two relevant data slices. Use synthetic data and show each control's evidence. Explain remaining limitations rather than declaring the product fair or compliant from a small test.
- **Self-check:** Connect concrete responsible-AI risks to oversight, data-use and evaluation controls.

- **Required reading:**
  - _Artificial Intelligence: A Modern Approach_, Chapter 27, "Philosophy, Ethics, and Safety of AI".
  - _Designing Machine Learning Systems_, Chapter 11, particularly "Responsible AI".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 3 and 4.
- **Technical references:** [NIST AI Risk Management Framework: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

### 8.9 AI application guardrails

- **Learning outcomes:** Explain layered input, output and action guardrails, including what each layer can and cannot prevent.
- **Applied exercises:** Add three explicit controls to the existing workflow: an input/schema or size check, an output-schema/business-rule check, and a code-enforced action-permission check. Test an allowed case and a rejected case at each boundary using the earlier evaluation harness. Include one case the checks cannot reliably decide and route it to review. Record latency or false-positive costs and avoid claiming complete protection.
- **Self-check:** Demonstrate layered guardrails with stated limits and a review path.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".

### 8.10 LLM and agent security testing

- **Learning outcomes:** Distinguish model safety, application security and infrastructure security. Explain prompt injection, data exfiltration, unsafe tool execution, excessive agency, denial-of-wallet attacks and malicious supply-chain components. Turn an LLM application threat model into repeatable tests.
- **Applied exercises:** Write a threat model for the existing RAG or agent project and select at least three applicable risks from the assigned security sources. Build repeatable local tests using synthetic secrets, malicious evidence/tool outputs and simulated permissions or actions. Include direct or indirect injection plus at least one permission/unsafe-action test and one execution-budget test. Record the expected application-level control, observed result and residual risk for each; run the deterministic checks in the CI pipeline from 8.3. Add MCP-specific attacks only if an MCP server is present.
- **Self-check:** Turn relevant threats into repeatable tests and distinguish measured mitigation from a security guarantee.

- **Required reading:**
  - _AI Engineering: Building Applications with Foundation Models_, Chapter 5, defensive prompt engineering.
  - _AI Engineering: Building Applications with Foundation Models_, Chapter 10, production controls.
- **Recommended reading:** _Building LLMs for Production_, Part IV.
- **Technical references:**
  - [OWASP Top 10 for LLM and Generative AI Applications](https://genai.owasp.org/llm-top-10/).
  - [MITRE ATLAS](https://atlas.mitre.org/).
  - [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices).

### 8.11 Production feedback systems

- **Learning outcomes:** Explain how explicit and implicit feedback becomes labelled evaluation data without creating misleading or unsafe loops.
- **Applied exercises:** Capture explicit ratings/corrections and one implicit signal for a few synthetic or consented interactions, linked by interaction and version IDs. Review which signals are actually evidence of quality and document their biases. Turn one reviewed failure into a labelled evaluation case in the Module 4 dataset; keep unreviewed feedback out of the accepted baseline. Automatic retraining is not required.
- **Self-check:** Demonstrate a reviewed feedback-to-evaluation path without treating every user signal as ground truth.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 9, "Continual Learning and Test in Production".

## Module 9: Machine learning foundations

**Module aim:** Deepen your model and statistical intuition after learning to ship AI systems.

**Module learning outcomes:** Explain the classical machine-learning workflow, generalisation, evaluation metrics, optimisation and probability concepts needed to reason about learned systems.

**Module practical assessment:** Build a reproducible classical ML experiment from problem framing through evaluation. It should demonstrate correct data splitting, baselines, metric selection and error analysis.

### 9.1 Machine learning paradigms and generalisation

- **Learning outcomes:** Distinguish supervised, unsupervised and reinforcement learning and explain generalisation, overfitting, underfitting and common failure modes.
- **Applied exercises:** Create a short decision notebook with three representative problem statements, one each for supervised, unsupervised and reinforcement learning. For each, identify the available observations, the feedback signal, a plausible baseline and a failure mode. Defer model training and the end-to-end experiment to Lesson 9.2.
- **Self-check:** Classify ML problems and identify common failure modes.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 1, "The Machine Learning Landscape".
- **Recommended reading:** _Machine Learning with PyTorch and Scikit-Learn_, Chapter 1, "Giving Computers the Ability to Learn from Data".

### 9.2 End-to-end machine learning workflow

- **Learning outcomes:** Explain problem framing, data splitting, leakage prevention, baselines, training and validation as one connected workflow.
- **Applied exercises:** Build an end-to-end tabular ML project with reproducible preprocessing, a baseline, training, validation and a held-out test. It should demonstrate a trustworthy process rather than only a high score.
- **Self-check:** Frame a problem, split data and build a baseline.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 2, "End-to-End Machine Learning Project".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 1, "Overview of Machine Learning Systems"; Chapter 2, "Introduction to Machine Learning Systems Design".

### 9.3 Classification metrics

- **Learning outcomes:** Explain accuracy, precision, recall, F1, ROC/AUC and confusion matrices, and choose metrics for imbalanced problems.
- **Applied exercises:** Build an interactive or notebook-based metric explorer that changes thresholds and class distributions. It should demonstrate how metric choice changes product decisions and error costs.
- **Self-check:** Interpret precision, recall, F1, ROC/AUC and confusion matrices.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 3, "Classification".
- **Recommended reading:** _An Introduction to Statistical Learning with Applications in Python_, Chapter 4, "Classification".

### 9.4 Gradient descent and regularisation

- **Learning outcomes:** Explain how loss, gradients, learning rate and regularisation influence optimisation and generalisation.
- **Applied exercises:** Use the chapter's small regression examples in two controlled comparisons. First vary learning rate in gradient descent and plot loss or parameter trajectories. Then vary polynomial complexity or regularisation strength with a fixed split and plot training/validation error. Explain convergence, instability and fit quality; do not change several factors simultaneously or require every failure mode to appear.
- **Self-check:** Isolate optimisation behaviour from the effect of model complexity and regularisation.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 4, "Training Models".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 7, "Continuous Optimization".

### 9.5 Probability for machine learning

- **Learning outcomes:** Explain conditional probability, Bayes’ rule, expectation, variance and Gaussian distributions as tools for reasoning about uncertainty.
- **Applied exercises:** Start with a small joint-probability table and compute marginals, conditional probabilities and one posterior using Bayes' rule. Calculate expectation and variance for a discrete distribution, then draw samples from a Gaussian and compare empirical mean/variance with the stated parameters. Explain which results are exact and which are finite-sample estimates. A full Bayesian inference engine is not required.
- **Self-check:** Connect conditional probability, Bayes, expectation and variance to exact calculations and samples.

- **Required reading:** _Mathematics for Machine Learning_, Chapter 6, "Probability and Distributions".
- **Recommended reading:** _An Introduction to Statistical Learning with Applications in Python_, Chapter 2, "Statistical Learning".

## Module 10: Deep learning and transformer architectures

**Module aim:** Understand how the models behind the APIs work without turning the roadmap into a research detour.

**Module learning outcomes:** Explain how neural networks learn and how transformer components combine to produce autoregressive language models.

**Module practical assessment:** Build and train a small neural network and a tiny GPT in PyTorch. They should demonstrate understanding of tensors, backpropagation, attention, training loops and generation rather than production performance.

### 10.1 Neural networks and backpropagation

- **Learning outcomes:** Explain the forward pass, loss calculation, backpropagation and parameter updates in a neural network.
- **Applied exercises:** Train a small perceptron or `MLPClassifier` using the chapter's Scikit-Learn example. Draw its layer structure and explain the forward pass, loss, backward propagation and update. For a single toy neuron, calculate a forward output and one weight update using a supplied gradient and the update rule from 9.4. Full manual backpropagation and PyTorch gradient inspection follow after 10.2.
- **Self-check:** Demonstrate a simple neural model and explain its learning steps before using autograd.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 9, "Introduction to Artificial Neural Networks".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 5, "Vector Calculus".

### 10.2 PyTorch fundamentals

- **Learning outcomes:** Explain tensor shapes, autograd, modules, datasets, DataLoaders and train/evaluation modes in PyTorch.
- **Applied exercises:** Build a PyTorch classifier with a custom dataset, model module, training loop and saved checkpoint. It should demonstrate correct tensor handling and separation of training from evaluation.
- **Self-check:** Use tensors, autograd, modules and DataLoaders.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 10, "Building Neural Networks with PyTorch".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Appendix A, "Introduction to PyTorch".
- **Technical references:** [PyTorch documentation](https://docs.pytorch.org/docs/stable/index.html).

### 10.3 Neural network training

- **Learning outcomes:** Explain batching, optimisation, validation, regularisation, checkpoints and the signals of underfitting or overfitting.
- **Applied exercises:** Build a controlled training experiment comparing at least two optimisation or regularisation choices. It should demonstrate interpretation of learning curves and selection based on validation evidence.
- **Self-check:** Train, validate, save and restore a model.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 11, "Training Deep Neural Networks".
- **Recommended reading:** _Deep Learning_, Chapters 6, 8 and 11: deep feedforward networks, optimisation and practical methodology.

### 10.4 Transformer architecture

- **Learning outcomes:** Explain the purpose and data flow of embeddings, positional information, attention, residual connections and feed-forward blocks.
- **Applied exercises:** Use the chapter's PyTorch transformer-layer or encoder example with a tiny batch of embedded tokens. Annotate input/output tensor shapes and the roles of positional information, attention, residual connections, normalisation and feed-forward layers. Explain encoder self-attention versus decoder causal attention. Use library attention here; implement its internals in 10.5.
- **Self-check:** Trace the transformer architecture using existing components before coding attention from scratch.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, "Transformers for Natural Language Processing and Chatbots".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".

### 10.5 Attention mechanisms

- **Learning outcomes:** Explain queries, keys, values, scaled dot-product attention, causal masking and multi-head attention.
- **Applied exercises:** Implement causal multi-head attention and test masking and output shapes. It should demonstrate mathematical understanding of attention rather than use of a high-level transformer component.
- **Self-check:** Implement causal multi-head attention.

- **Required reading:** _Build a Large Language Model (From Scratch)_, Chapter 3, "Coding Attention Mechanisms".
- **Recommended reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, "Transformers for Natural Language Processing and Chatbots".

### 10.6 Compact GPT implementation

- **Learning outcomes:** Explain how tokenisation, embeddings, transformer blocks, language-model loss and autoregressive generation form a GPT.
- **Applied exercises:** Assemble a tiny GPT using the transformer blocks from Chapter 4 and the attention from 10.5. Prepare short token sequences with the tokenizer already used in Module 2 and the DataLoader skills from 10.2; make next-token targets by shifting the sequence. Follow Chapter 5 for cross-entropy loss, a short training run, generation and saving/reloading weights. Plot training/validation loss and compare a generated sample before and after training without expecting useful language quality.
- **Self-check:** Connect architecture, shifted-token loss, training, generation and checkpointing in a tiny model.

- **Required reading:** _Build a Large Language Model (From Scratch)_, Chapter 4, "Implementing a GPT Model from Scratch to Generate Text", and Chapter 5, "Pretraining on Unlabeled Data", for loss, the training loop, checkpointing and generation.
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".

## Module 11: Model adaptation and local inference

**Module aim:** Know when model adaptation is justified and how serving tradeoffs work.

**Module learning outcomes:** Decide when fine-tuning is justified and explain dataset, adaptation, quantisation and model-serving tradeoffs.

**Module practical assessment:** Run a measured parameter-efficient fine-tuning experiment and design a local inference architecture. Compare results honestly with a baseline, including regressions or no improvement, and record explicit quality, memory, latency and cost tradeoffs.

### 11.1 Fine-tuning decision criteria

- **Learning outcomes:** Decide when fine-tuning is justified instead of prompting, retrieval, more context or a stronger base model.
- **Applied exercises:** Build a decision record for a real use case, including baseline evaluations for prompting and retrieval alternatives. It should demonstrate that fine-tuning follows evidence rather than novelty.
- **Self-check:** Rule out prompting, retrieval and a better base model first.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 7, "Finetuning".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 5, "Supervised Fine-Tuning".

### 11.2 Fine-tuning dataset engineering

- **Learning outcomes:** Explain how data quality, formatting, distribution, privacy and train-validation splits determine fine-tuning outcomes.
- **Applied exercises:** Build a versioned dataset pipeline that validates, deduplicates, formats and splits examples. It should demonstrate provenance, quality checks and prevention of train-evaluation leakage.
- **Self-check:** Create, inspect and version a small training dataset.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 8, "Dataset Engineering".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 5, "Supervised Fine-Tuning".

### 11.3 Supervised fine-tuning

- **Learning outcomes:** Explain the supervised fine-tuning objective, training data format and how to measure improvement against a baseline.
- **Applied exercises:** Adapt the chapter's supervised fine-tuning example to a small model and focused instruction dataset, using the data checks from 11.2. Keep an untouched baseline and compare both on the same held-out cases with the Module 4 evaluator. Record training loss, a few generations and improvements or regressions. Choose a model/data size that fits the available compute; report resource limits honestly.
- **Self-check:** Measure what supervised fine-tuning changes rather than requiring a positive result.

- **Required reading:** _Hands-On Large Language Models_, Chapter 12, "Fine-Tuning Generation Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Chapter 7, "Fine-Tuning to Follow Instructions".

### 11.4 Parameter-efficient fine-tuning with LoRA and QLoRA

- **Learning outcomes:** Explain low-rank adapters and how LoRA and QLoRA reduce memory and compute at the cost of constrained adaptation.
- **Applied exercises:** Attach LoRA adapters to a small model and inspect which parameters are trainable versus frozen. Compare trainable-parameter counts for two ranks, then train one configuration on the 11.3 task and measure runtime, memory when available, and held-out quality. Explain the QLoRA memory tradeoff; run its quantised variant only after the linked quantisation guide and on supported hardware.
- **Self-check:** Demonstrate low-rank adaptation, frozen base weights and measured resource/quality tradeoffs.

- **Required reading:** _Hands-On Large Language Models_, Chapter 12, "Fine-Tuning Generation Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Appendix E, "Parameter-Efficient Fine-Tuning with LoRA".
- **Technical references:** [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/) and [Transformers bitsandbytes quantisation guide](https://huggingface.co/docs/transformers/quantization/bitsandbytes) for QLoRA.

### 11.5 Quantisation and local inference

- **Learning outcomes:** Explain how reduced numerical precision changes memory use, throughput, latency and model quality.
- **Applied exercises:** Compare two supported precisions of the same local model using the assigned quantisation method, fixed prompts and the same generation limits. Record load memory when measurable, latency and the Module 4 quality checks, and explain the representation tradeoff. If the runtime cannot execute both variants, calculate their parameter-storage estimates from the chapter and document the constraint; keep theoretical estimates separate from measured benchmarks.
- **Self-check:** Compare numerical precision choices while distinguishing calculations from executable measurements.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".
- **Recommended reading:** _Building LLMs for Production_, Chapter 12, "Deployment and Optimization".
- **Technical references:** [Hugging Face bitsandbytes documentation](https://huggingface.co/docs/transformers/quantization/bitsandbytes).

### 11.6 Model inference architecture

- **Learning outcomes:** Explain prefill, decoding, KV caching, batching, throughput, latency and autoscaling in a model-serving system.
- **Applied exercises:** Choose one serving path described in the assigned sources, such as vLLM or the book's inference endpoint, and expose a small model behind the existing provider interface. With fixed prompts, measure request latency and throughput at two concurrency levels, note the configured batching/precision and inspect an overload or timeout result. Explain the deployment tradeoffs and reuse Module 8 configuration/logging controls. If no compatible runtime is available, produce the topology and request-flow design and explicitly leave runtime benchmarking incomplete.
- **Self-check:** Connect inference-serving choices to a reproducible request workload and explicit hardware limits.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization"; Chapter 9, "RAG Inference Pipeline"; Chapter 10, "Inference Pipeline Deployment".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 9, "Inference Optimization".
- **Technical references:** [vLLM documentation](https://docs.vllm.ai/).

## Module 12: Capstone in AI engineering

**Module aim:** Combine the roadmap's skills into one credible, explainable product.

**Module learning outcomes:** Synthesise product thinking, AI application design, backend engineering, evaluation, data systems and operations into defensible technical decisions.

**Module practical assessment:** Build a portfolio-ready full-stack AI product with a real user workflow, RAG or tools, evaluation, CI/CD, observability, security and clear documentation. It should demonstrate end-to-end ownership and measured engineering maturity.

### 12.1 Product definition and architecture

- **Learning outcomes:** Frame an AI product around a real user outcome, explicit constraints, measurable success and defensible architecture decisions.
- **Applied exercises:** Build a product brief, architecture document and evaluation plan before implementation. They should demonstrate clear scope, user value, risks, alternatives and measurable acceptance criteria.
- **Self-check:** Define the user, problem, workflow, architecture and success measures.

- **Required reading:** _LLM Engineer's Handbook_:
  - Chapter 1, "Understanding the LLM Twin Concept and Its Architecture".
  - Chapter 4, "RAG Feature Pipeline".
  - Chapter 7, "Evaluating LLMs".
  - Chapter 10, "Inference Pipeline Deployment".
  - Chapter 11, "MLOps and LLMOps".
- **Recommended reading:**
  - _Designing Data-Intensive Applications_, 2nd ed., Chapter 2, "Defining Nonfunctional Requirements".
  - _Designing Data-Intensive Applications_, 2nd ed., Chapter 3, "Data Models and Query Languages".
  - _Designing Machine Learning Systems_, Chapter 2, "Introduction to Machine Learning Systems Design".
  - _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".
  - _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".

### 12.2 Full-stack AI system implementation

- **Learning outcomes:** Explain how the frontend, API, data, retrieval, tools and model layers interact and fail as one complete product.
- **Applied exercises:** Implement one complete user workflow from the 12.1 brief using Next.js, the existing FastAPI/authentication/PostgreSQL components, a provider adapter and either RAG or tools. Reuse the selected earlier project instead of implementing every AI pattern. Demonstrate successful, loading, empty and failed states across the frontend/API boundary. Add a model router or both RAG and tools only if the brief calls for them.
- **Self-check:** Integrate the chosen product workflow with the capabilities justified by its architecture.

- **Required reading:** The source code, ADRs and notes from your strongest earlier roadmap projects.
- **Recommended reading:** [Next.js documentation](https://nextjs.org/docs) and [FastAPI documentation](https://fastapi.tiangolo.com/).
- **Technical references:** [Next.js documentation](https://nextjs.org/docs), [FastAPI documentation](https://fastapi.tiangolo.com/) and [PostgreSQL documentation](https://www.postgresql.org/docs/).

### 12.3 Product evaluation and operations

- **Learning outcomes:** Explain the evidence required to call an AI product reliable, observable, secure, deployable and maintainable.
- **Applied exercises:** Add automated evaluations appropriate to the workflow chosen in 12.2: for RAG, evaluate retrieval and grounded generation; for a tools-based workflow, evaluate task success, tool selection, argument validity and controlled failure handling. Apply both sets of checks if the product uses both. Add CI/CD, deployment, logs, traces, cost monitoring, security controls and feedback capture using the Module 8 components. Demonstrate that product quality is measurable and operational failures are diagnosable.
- **Self-check:** Demonstrate evaluations matched to the chosen RAG or tools workflow, alongside CI/CD, logging, tracing, security and feedback.

- **Required reading:** Revisit the evaluation harness from Module 4. For a RAG product, revisit lesson 5.10 on retrieval and generation evaluation; for a tools-based product, revisit lessons 6.3 and 6.7 on task success, tool-use checks and failure handling. Revisit both when both capabilities are present. For either product, revisit the Module 8 lessons on CI/CD, logging, tracing, cost, guardrails and feedback. Use each lesson's current official documentation for its component.
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".

### 12.4 Technical portfolio and case study

- **Learning outcomes:** Present technical decisions, alternatives, failures and measured results as a credible engineering narrative.
- **Applied exercises:** Write `README.md`, `ARCHITECTURE.md`, `EVALUATION.md` and `SECURITY.md` for the capstone, drawing on its actual diagrams, decisions, tests, evaluations and traces. Explain alternatives considered, a failure investigated, measured outcomes and remaining limitations. Cross-link the evidence and make the case study ready to share; do not replace missing measurements with invented results.
- **Self-check:** Present an evidence-backed account of decisions, tradeoffs, failures and outcomes.

- **Required reading:** Your deployed application, evaluation reports, traces, diagrams and decision records.
- **Recommended reading:** Your architecture decision records, system diagram, runbooks and evaluation reports.

## Completion requirements

Do not mark a lesson complete because you reached the end of a chapter. Mark it complete when you can explain the central idea without the book open and finish the practice task. You must also point to a concrete result, such as code, a test, an evaluation report, a trace or an architecture decision.

For book chapters that cover more than the lesson needs, read the named section first and skim the rest. Return to the full chapter when the project exposes a gap. This keeps the roadmap practical without weakening the foundations.
