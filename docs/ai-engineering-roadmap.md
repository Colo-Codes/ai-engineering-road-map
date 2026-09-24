# AI Engineering Roadmap

This curriculum defines module assessments, lesson learning outcomes, applied exercises and reading assignments. It uses the supplied editions and current technical references.

## Curriculum structure

Each module contains an aim, learning outcomes and a practical assessment. Each topic pairs its learning outcomes with applied exercises.

Required reading establishes the main concepts. Recommended reading provides additional depth, while technical references support implementation with current APIs and protocols.

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
| _Building Data Science Applications with FastAPI_, 2nd ed. | Voron |

The following supplied books provide optional references for advanced study:

- _Artificial Intelligence: A Modern Approach_
- _Deep Reinforcement Learning with Python_
- _Generative Deep Learning_

### Optional additions

The context and MCP lessons include two optional books for deeper study:

- [_Hands-On Context Engineering_](https://www.oreilly.com/library/view/hands-on-context-engineering/0642572371005/) by Xinye Tang and Wei Sun
- [_Learn Model Context Protocol with Python_](https://www.oreilly.com/library/view/learn-model-context/9781806103232/) by Christoffer Noring

## Module 0: Advanced Python Programming

**Module aim:** Develop advanced Python proficiency for AI engineering, with emphasis on typed, modular and asynchronous application development.

**Module learning outcomes:** Apply Python syntax, typing, modules, error management and asynchronous execution to structured software systems.

**Module practical assessment:** A typed and tested command-line API client demonstrating modular structure, data transformation, persistence, concurrent I/O and controlled failure management.

### 0.1 Python environments and dependency management

- **Learning outcomes:** Explain how interpreters, virtual environments and dependency files isolate a project and make its execution reproducible.
- **Applied exercises:** Build a Python repository with a virtual environment, `pyproject.toml`, locked dependencies and documented commands. The submission must demonstrate that another developer can recreate and run the project without hidden machine-specific setup.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 1, "Python Development Environment Setup".
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 1, "Getting Started".

### 0.2 Python syntax and data structures

- **Learning outcomes:** Translate familiar TypeScript concepts into Python while explaining Python data types, mutability, identity, equality, truthiness and `None`.
- **Applied exercises:** Build a collection of small typed utilities that transform realistic strings, lists, tuples, sets and dictionaries. The submission must demonstrate idiomatic Python rather than JavaScript syntax translated line by line.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** _Python Crash Course_, 3rd ed.:
  - Chapter 2, "Variables and Simple Data Types".
  - Chapter 3, "Introducing Lists".
  - Chapter 4, "Working with Lists".
  - Chapter 5, "if Statements".
  - Chapter 6, "Dictionaries".

### 0.3 Control flow and comprehensions

- **Learning outcomes:** Select appropriate uses of conditionals, loops and comprehensions, and evaluate readability and brevity as competing design concerns.
- **Applied exercises:** Build a data-processing command that filters, groups and summarises API-shaped records. The submission must demonstrate correct control flow, readable comprehensions and handling of empty or malformed inputs.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** _Python Crash Course_, 3rd ed.:
  - Chapter 4, "Working with Lists".
  - Chapter 5, "if Statements".
  - Chapter 6, "Dictionaries".
  - Chapter 7, "User Input and while Loops".

### 0.4 Functions, modules and package design

- **Learning outcomes:** Explain Python function arguments, scope, imports and module boundaries well enough to organise application code deliberately.
- **Applied exercises:** Refactor the data-processing command into a package of focused modules and testable functions. The submission must demonstrate separation of concerns, predictable inputs and outputs, and a clean public interface.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 8, "Functions".

### 0.5 Object-oriented programming in Python

- **Learning outcomes:** Decide when a Python class adds value, and explain composition, inheritance and the responsibilities of a useful abstraction.
- **Applied exercises:** Build interchangeable API-client and service implementations behind a small abstraction. The submission must demonstrate appropriate use of classes, composition and dependency substitution without unnecessary inheritance.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 9, "Classes".

### 0.6 Exception management

- **Learning outcomes:** Distinguish recoverable failures from programming errors and explain exception propagation, custom exceptions and resource cleanup.
- **Applied exercises:** Add explicit failure paths for network, file, configuration and validation errors. The submission must demonstrate useful error messages, correct cleanup and recovery only where recovery is safe.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 10, "Files and Exceptions".

### 0.7 Type hints and static analysis

- **Learning outcomes:** Explain what type hints can and cannot guarantee, and use unions, optional values, collections and typed return values correctly.
- **Applied exercises:** Type every public boundary in the project and run a static type checker successfully. The submission must demonstrate that invalid states and ambiguous contracts are reduced before runtime.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** [Python typing documentation](https://docs.python.org/3/library/typing.html).

### 0.8 Iterators, generators and lazy evaluation

- **Learning outcomes:** Explain lazy evaluation, the iteration protocol and the memory tradeoffs between generators and materialised collections.
- **Applied exercises:** Build a streaming parser that processes a large file or paginated result incrementally. The submission must demonstrate bounded memory use and correct iteration behaviour.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** [Python iterators and generators](https://docs.python.org/3/tutorial/classes.html#iterators).

### 0.9 Asynchronous I/O and concurrency

- **Learning outcomes:** Explain the event loop, coroutines and tasks, including the difference between concurrency, parallelism and blocking work.
- **Applied exercises:** Build an asynchronous API aggregator with timeouts and bounded concurrency, then compare it with a sequential implementation. The submission must demonstrate when async I/O improves throughput and how failures are contained.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 2, "Python Programming Specificities".
- **Recommended reading:** [Python asyncio documentation](https://docs.python.org/3/library/asyncio.html).

## Module 1: API Engineering with FastAPI

**Module aim:** Develop production-oriented API engineering skills using FastAPI, typed schemas, persistence, security, testing and deployment.

**Module learning outcomes:** Explain and apply HTTP semantics, validation, dependency management, persistence, security, testing and deployment in a Python API.

**Module practical assessment:** A containerised FastAPI service with typed schemas, PostgreSQL persistence, authentication, asynchronous tests and explicit module boundaries.

### 1.1 REST API design with FastAPI

- **Learning outcomes:** Explain how HTTP methods, status codes, routing, validation and the FastAPI request lifecycle combine to form a well-designed REST API.
- **Applied exercises:** Turn the Module 0 utility into a modular FastAPI service with routers, request bodies, query and path parameters, response models and appropriate error responses. The submission must demonstrate sound HTTP semantics and thin route handlers.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 3, "Developing a RESTful API with FastAPI".
- **Recommended reading:** [FastAPI documentation](https://fastapi.tiangolo.com/).

### 1.2 Data validation with Pydantic

- **Learning outcomes:** Explain how schemas validate, transform, serialise and protect data at application boundaries.
- **Applied exercises:** Build separate request, domain and response models with nested values, enums and custom validation. The submission must demonstrate that invalid data cannot silently enter or leave the application.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 4, "Managing Pydantic Data Models in FastAPI".
- **Recommended reading:** [Pydantic documentation](https://docs.pydantic.dev/latest/).

### 1.3 Dependency injection and application boundaries

- **Learning outcomes:** Explain inversion of control and how dependency injection improves substitution, lifecycle management and testability.
- **Applied exercises:** Separate endpoints, services, repositories and external clients, wiring them through FastAPI dependencies. The submission must demonstrate that production dependencies can be replaced in tests without changing business logic.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 5, "Dependency Injection in FastAPI".
- **Recommended reading:** [FastAPI dependency injection](https://fastapi.tiangolo.com/tutorial/dependencies/).

### 1.4 Asynchronous persistence and database access

- **Learning outcomes:** Explain async database sessions, transactions, migrations and repository boundaries, including where consistency can fail.
- **Applied exercises:** Add PostgreSQL, async SQLAlchemy, migrations and transactional CRUD operations. The submission must demonstrate safe session handling, durable state and persistence logic isolated from HTTP concerns.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 6, "Databases and Asynchronous ORMs".
- **Recommended reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 3, "Data Models and Query Languages".
- **Technical references:** [SQLAlchemy asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html) and [Alembic](https://alembic.sqlalchemy.org/).

### 1.5 API authentication and authorisation

- **Learning outcomes:** Distinguish authentication from authorisation and explain tokens, password handling, CORS, secrets and common API threats.
- **Applied exercises:** Build registration or identity integration, protected endpoints and resource-level authorisation. The submission must demonstrate secure secret handling and that authenticated users cannot access data they do not own.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 7, "Managing Authentication and Security in FastAPI".
- **Recommended reading:** [OWASP API Security Top 10](https://owasp.org/API-Security/).

### 1.6 Asynchronous API testing

- **Learning outcomes:** Choose between unit and integration tests and explain async fixtures, mocks, dependency overrides and test isolation.
- **Applied exercises:** Build an async test suite covering services, endpoints, database interactions and failure cases. The submission must demonstrate repeatability, isolated state and confidence in behaviour rather than implementation details.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 9, "Testing an API Asynchronously with pytest and HTTPX".
- **Recommended reading:** _Python Crash Course_, 3rd ed., Chapter 11, "Testing Your Code".

### 1.7 Application packaging and deployment

- **Learning outcomes:** Explain the runtime concerns that separate local code from a deployable service, including configuration, containers, processes and health checks.
- **Applied exercises:** Containerise and deploy the API with environment-based configuration, migrations and health endpoints. The submission must demonstrate reproducible deployment and a clear distinction between build-time and runtime concerns.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 10, "Deploying a FastAPI Project".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".

## Module 2: Foundations of AI and Large Language Models

**Module aim:** Establish the conceptual and practical foundations required to integrate large language models into software systems.

**Module learning outcomes:** Explain tokens, embeddings, transformers, generation controls, model ecosystems, multimodal inputs and output constraints in foundation-model applications.

**Module practical assessment:** A provider-agnostic AI service with structured outputs, streaming, controlled generation and multimodal input, supported by comparative model evaluation.

### 2.1 The discipline of AI engineering

- **Learning outcomes:** Distinguish AI engineering from model training and explain the application layers, feedback loops and tradeoffs around a foundation model.
- **Applied exercises:** Build an architecture diagram and executable service skeleton covering frontend, API, AI logic, provider and data layers. The submission must demonstrate clear ownership of deterministic and probabilistic responsibilities.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 1, "Introduction to Building AI Applications with Foundation Models".
- **Recommended reading:** _Building LLMs for Production_, Chapter 1, "Introduction to LLMs".

### 2.2 Tokenisation and context windows

- **Learning outcomes:** Explain how tokenisation affects meaning, context limits, latency and cost across different model families.
- **Applied exercises:** Build a tokeniser explorer that compares token counts, context usage and estimated cost for realistic inputs. The submission must demonstrate awareness of how text representation affects application constraints.

- **Required reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 2, "Understanding LLMs".

### 2.3 Embedding representations

- **Learning outcomes:** Explain how embeddings encode useful similarity, how cosine similarity works and where semantic distance can mislead.
- **Applied exercises:** Build a small semantic-similarity explorer over a labelled sentence collection. The submission must demonstrate vector creation, nearest-neighbour comparison and analysis of both convincing and misleading matches.

- **Required reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 3, "Analytic Geometry".

### 2.4 Transformer architecture fundamentals

- **Learning outcomes:** Trace a prompt through embeddings, attention blocks, logits and sampling, including the purpose of context and KV caching.
- **Applied exercises:** Build an executable or visual forward-pass trace using a small pre-trained transformer. The submission must demonstrate the journey from token IDs to next-token probabilities without requiring full model training.

- **Required reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Chapter 1, "Understanding Large Language Models".

### 2.5 Model provider APIs and abstractions

- **Learning outcomes:** Explain differences in model-provider capabilities, limits, errors and usage metadata, and identify the requirements of a stable provider abstraction.
- **Applied exercises:** Build one typed interface with adapters for at least two providers. The submission must demonstrate provider substitution, consistent errors and normalised usage, latency and response metadata.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models".
- **Recommended reading:** _Building LLMs for Production_:
  - Chapter 1, "Introduction to LLMs".
  - Chapter 2, "LLM Architectures and Landscape".
  - Chapter 3, "LLMs in Practice".
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/).

### 2.6 Structured model outputs

- **Learning outcomes:** Distinguish syntactically valid JSON from schema-valid domain data and explain validation, retry and failure-handling strategies.
- **Applied exercises:** Build a structured extraction endpoint whose responses are validated by Pydantic and tested with malformed outputs. The submission must demonstrate that model text is never trusted before validation.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 4, "Managing Pydantic Data Models in FastAPI".
- **Technical references:** [OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

### 2.7 Streaming model responses

- **Learning outcomes:** Explain streaming transport choices, partial output, cancellation, backpressure and mid-stream failure handling.
- **Applied exercises:** Build a streaming model endpoint and a frontend consumer with cancellation and visible error recovery. The submission must demonstrate a responsive user experience without hiding partial-response failure modes.

- **Required reading:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/).
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 8, "Defining WebSockets for Two-Way Interactive Communication".
- **Technical references:** [OpenAI streaming responses](https://platform.openai.com/docs/guides/streaming-responses) and [Anthropic streaming messages](https://docs.anthropic.com/en/docs/build-with-claude/streaming).

### 2.8 Generation controls and decoding

- **Learning outcomes:** Explain how temperature, top-k, top-p, stop sequences, repetition penalties and random seeds affect model output. Select task-appropriate controls and assess their limitations.
- **Applied exercises:** Build a generation playground that runs the same prompt several times across different decoding configurations. Display every parameter and compare consistency, latency, token usage and structured-output validity. Recommend settings for extraction, classification and creative generation.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 2, "Understanding Foundation Models", particularly the sampling sections.
- **Recommended reading:**
  - _Build a Large Language Model (From Scratch)_, Chapter 5, section 5.3, "Decoding strategies to control randomness".
  - _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, decoding and sampling sections.
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/) for supported generation parameters.

### 2.9 Hosted, open-weight and local model ecosystems

- **Learning outcomes:** Compare hosted APIs, open-weight models, self-hosted inference and local development with Ollama. Explain how Hugging Face distribution, numerical precision and quantisation affect deployment choices. Select models based on capability, privacy, licence, latency, operational effort and cost.
- **Applied exercises:** Extend the provider abstraction to support two hosted providers and one local model through Ollama. Run the same evaluation dataset against all three. Compare quality, latency, cost, privacy and operational complexity before recommending a model.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 2 and 9.
- **Recommended reading:**
  - _LLM Engineer's Handbook_, Chapters 8–10.
  - _Hands-On Large Language Models_, model selection and model openness sections.
- **Technical references:** [Hugging Face local applications](https://huggingface.co/docs/hub/local-apps) and [using Hugging Face GGUF models with Ollama](https://huggingface.co/docs/hub/ollama).

### 2.10 Multimodal models for images and documents

- **Learning outcomes:** Explain how multimodal models represent and process text, images and documents. Distinguish image understanding from image generation. Explain how image resolution and quantity affect context usage and cost. Compare OCR, layout extraction and native multimodal processing. Identify failures involving diagrams, small text, tables and spatial relationships.
- **Applied exercises:** Build a service that accepts an image or PDF with a question about the supplied content. Extract structured information, cite the relevant page or image, report uncertainty, and reject unsupported or unreadable inputs.

- **Required reading:** _Hands-On Large Language Models_, Chapter 9, "Multimodal Large Language Models".
- **Recommended reading:**
  - _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 16, "Vision and Multimodal Transformers".
  - _Generative Deep Learning_, Chapter 13, "Multimodal Models".
  - _AI Engineering: Building Applications with Foundation Models_, Chapter 6, particularly "RAG Beyond Texts".
- **Technical references:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/) for image inputs and document processing.

### 2.11 Speech and audio systems (extension)

This extension covers an area that the supplied books do not explore deeply.

- **Learning outcomes:** Explain the basic architecture of speech-to-text, text-to-speech and speech-to-speech systems. Handle audio formats, sampling rates, transcription, speaker turns, streaming, latency and interruption. Include consent, privacy and audio-specific evaluation in the design.
- **Applied exercises:** Build a voice-note service that accepts an audio file and produces a timestamped transcription. Extract a structured summary and action items, then optionally generate a spoken response. Store the source transcription separately from the model-generated interpretation.

- **Required reading:** [Hugging Face Audio Course](https://huggingface.co/learn/audio-course/chapter0/introduction), Units 2, 5, 6 and 7.

## Module 3: Prompt and Context Engineering

**Module aim:** Develop systematic methods for prompt design, context construction, task decomposition and application-level control.

**Module learning outcomes:** Design testable prompts and context systems using explicit selection, budgeting, provenance, compaction, isolation, decomposition and verification methods.

**Module practical assessment:** A deterministic multi-stage AI workflow with managed context, structured intermediate results, verification and reliable long-context operation.

### 3.1 LLM application architecture

- **Learning outcomes:** Separate deterministic application logic from probabilistic model work and explain the boundaries between user, model and domain representations.
- **Applied exercises:** Build a workflow that transforms user input into a model-ready request and converts the result back into a domain object. The submission must demonstrate explicit boundaries and keep business rules outside prompts.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 4, "Designing LLM Applications".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 1, "Introduction to Building AI Applications with Foundation Models".

### 3.2 Prompt content and context sources

- **Learning outcomes:** Explain how static instructions, examples, retrieved evidence and dynamic data influence model behaviour and consume the context budget.
- **Applied exercises:** Build controlled prompt variants that add one content type at a time. Evaluate each variant against the same dataset to measure its contribution.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".

### 3.3 Prompt structure and instruction hierarchy

- **Learning outcomes:** Explain how hierarchy, delimiters, ordering and instruction precedence make prompts easier to maintain and test.
- **Applied exercises:** Build reusable, versioned prompt templates with named sections and typed inputs. The submission must demonstrate clarity, testability and safe separation of instructions from untrusted data.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 6, "Assembling the Prompt".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 5, "Prompt Engineering".

### 3.4 Task decomposition and verification

- **Learning outcomes:** Identify tasks that benefit from controlled decomposition and explain how intermediate validation reduces compound failures.
- **Applied exercises:** Build one task in both single-call and multi-stage forms, then evaluate them against the same dataset. The submission must demonstrate evidence-based decomposition and validation of intermediate results.

- **Required reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content"; Chapter 6, "Assembling the Prompt"; Chapter 7, "Taming the Model".

### 3.5 Prompt injection and trust boundaries

- **Learning outcomes:** Explain prompt-injection threat models, trust boundaries and the limitations of prompt-only defences.
- **Applied exercises:** Build an adversarial test suite and layered controls around untrusted instructions, retrieved content and tool access. The submission must demonstrate that security decisions are enforced in code, not delegated to the model.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 5, "Prompt Engineering".
- **Recommended reading:** _Building LLMs for Production_, Chapter 4, "Introduction to Prompting".
- **Technical references:** [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/).

### 3.6 Context selection, assembly and budgeting

- **Learning outcomes:** Explain that context includes instructions, conversation history, retrieved evidence, tool definitions, intermediate results and application state. Decide what enters the context, where it appears, and what must stay excluded. Assign token budgets, trust levels and provenance to each source. Retrieve information only when the task needs it.
- **Applied exercises:** Build a context assembler for instructions, conversation history, retrieved documents, tool definitions and current task state. Assign priorities, enforce a configurable token budget, remove duplicates and preserve source metadata. Record all inclusions and exclusions without silently removing system or safety instructions.

- **Required reading:**
  - _Prompt Engineering for LLMs_, Chapter 5, "Prompt Content".
  - _Prompt Engineering for LLMs_, Chapter 6, "Assembling the Prompt".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 5 and 6.
- **Technical references:** [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
- **Further reading:** _Hands-On Context Engineering_ by Xinye Tang and Wei Sun.

### 3.7 Long-context management, compaction and isolation

- **Learning outcomes:** Diagnose lost information, conflicting instructions, oversized tool results, destructive summaries and cross-task contamination. Compare truncation, summarisation, retrieval, durable memory, task isolation and external state. Explain how long contexts increase latency and cost.
- **Applied exercises:** Extend the manual agent loop with context tracking, automatic compaction, external checkpoints and separate subtask contexts. Persist task state and recover after a process restart. Test essential information placed at the beginning, middle and end of a long conversation.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:**
  - _Prompt Engineering for LLMs_, Chapter 5, dynamic context and summarisation.
  - _Hands-On Large Language Models_, long-context limitations and generation sections.
- **Technical references:**
  - [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
  - [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
  - [How Anthropic built its multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system).

## Module 4: Evaluation of AI Systems

**Module aim:** Develop rigorous methods for measuring AI system quality before introducing retrieval, tool use or autonomous behaviour.

**Module learning outcomes:** Design evaluation datasets, deterministic checks, model-based judgements, analytical slices and regression thresholds for AI applications.

**Module practical assessment:** A reusable evaluation harness with versioned reference data, deterministic assertions, rubric-based judgements and comparative model reports suitable for continuous integration.

### 4.1 Evaluation methodology

- **Learning outcomes:** Define measurable success criteria and explain offline evaluation, online signals, error analysis and evaluation slices.
- **Applied exercises:** Build an evaluation specification for the Module 3 workflow, including metrics, thresholds, failure categories and a review process. The submission must demonstrate that quality is defined before optimisation begins.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 3, "Evaluation Methodology".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".

### 4.2 Evaluation dataset design

- **Learning outcomes:** Explain how representativeness, annotation quality, metadata, leakage and slicing affect the credibility of an evaluation set.
- **Applied exercises:** Build and version a curated golden dataset with normal, difficult and adversarial examples plus useful metadata. The submission must demonstrate coverage of meaningful user and failure scenarios.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

### 4.3 Deterministic evaluation methods

- **Learning outcomes:** Recognise outputs suitable for ordinary program logic and justify deterministic checks when outcomes permit them.
- **Applied exercises:** Build assertions for schema validity, required facts, forbidden content, calculations and business rules. The submission must demonstrate precise, inexpensive evaluation without unnecessary model judgement.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 6, "Model Development and Offline Evaluation".

### 4.4 Model-based evaluation

- **Learning outcomes:** Explain the strengths, biases and failure modes of LLM judges, including rubric design, calibration and structured scoring.
- **Applied exercises:** Build a rubric-based judge with structured output and calibrate it against human-labelled examples. The submission must demonstrate agreement measurement, judge limitations and review of uncertain cases.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 3, "Evaluation Methodology".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

### 4.5 Comparative model evaluation and selection

- **Learning outcomes:** Compare models as a multi-objective decision across quality, latency, cost, context and structured-output reliability.
- **Applied exercises:** Build a benchmark that runs the same dataset across multiple models and produces a comparison report. The submission must demonstrate an evidence-based model choice rather than preference or benchmark reputation alone.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 6, "Prompt Engineering".

### 4.6 Regression evaluation

- **Learning outcomes:** Explain how versioned datasets, baselines, thresholds and CI gates detect quality regressions across application changes.
- **Applied exercises:** Add evaluation regression checks to CI for model, prompt and context changes. The submission must demonstrate that unacceptable quality loss blocks release and that approved changes update a documented baseline.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 10, "Evaluating LLM Applications".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".

## Module 5: Information Retrieval and Retrieval-Augmented Generation

**Module aim:** Develop retrieval-augmented generation systems through disciplined ingestion, search, reranking, grounding and evaluation.

**Module learning outcomes:** Explain the layers of a RAG system and diagnose failures in ingestion, chunking, retrieval, reranking, grounding and generation.

**Module practical assessment:** A deployed RAG system with traceable ingestion, hybrid retrieval, reranking, grounded citations and separate relevance and faithfulness evaluations.

### 5.1 Embedding geometry

- **Learning outcomes:** Explain vectors, norms, distance and cosine similarity well enough to reason about embedding-based retrieval behaviour.
- **Applied exercises:** Build a small vector-geometry lab that calculates and visualises similarity for labelled examples. The submission must demonstrate mathematical intuition about neighbourhoods, magnitude and misleading proximity.

- **Required reading:** _Hands-On Large Language Models_, Chapter 2, "Tokens and Embeddings".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 2, "Linear Algebra"; Chapter 3, "Analytic Geometry".

### 5.2 Semantic search

- **Learning outcomes:** Explain the dense-retrieval pipeline and how Recall@k, precision and relevance reveal different retrieval failures.
- **Applied exercises:** Build a dense semantic-search baseline over a realistic corpus with labelled queries. The submission must demonstrate retrieval, ranking and metric-driven error analysis rather than only plausible-looking results.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Technical references:** [Sentence Transformers semantic search](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html).

### 5.3 Retrieval ingestion pipelines

- **Learning outcomes:** Explain the stages of a reliable ingestion pipeline, including cleaning, metadata, provenance, idempotency and reprocessing.
- **Applied exercises:** Build a repeatable ingestion pipeline that parses documents, cleans content, attaches provenance and records processing state. The submission must demonstrate safe re-runs, traceability and explicit failure recovery.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Building LLMs for Production_, Chapter 8, "Indexes, Retrievers, and Data Preparation".

### 5.4 Document chunking strategies

- **Learning outcomes:** Explain how chunk size, overlap and document structure affect recall, precision, context quality and citation accuracy.
- **Applied exercises:** Build a benchmark comparing fixed-token, recursive, paragraph, heading-aware and semantic chunking. The submission must demonstrate a measured strategy choice based on retrieval and answer quality.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Building LLMs for Production_, Chapter 8, "Indexes, Retrievers, and Data Preparation".

### 5.5 Vector databases and indexes

- **Learning outcomes:** Explain vector indexing, approximate nearest-neighbour search, metadata filtering and the tradeoffs of common vector stores.
- **Applied exercises:** Build a vector index with either PostgreSQL and pgvector or Qdrant, including metadata filters and index configuration. The submission must demonstrate correct persistence, filtered retrieval and understanding of recall-latency tradeoffs.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Technical references:** [pgvector](https://github.com/pgvector/pgvector) or [Qdrant documentation](https://qdrant.tech/documentation/).

### 5.6 Lexical and full-text retrieval

- **Learning outcomes:** Explain lexical retrieval and BM25, including why exact terms can outperform semantic similarity for some queries.
- **Applied exercises:** Build a BM25 or database full-text baseline over the same corpus. The submission must demonstrate strong handling of identifiers, names and exact terminology, with metrics comparable to dense retrieval.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 4, "Storage and Retrieval".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Technical references:** [PostgreSQL full-text search](https://www.postgresql.org/docs/current/textsearch.html) or [Elasticsearch BM25](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html).

### 5.7 Hybrid retrieval

- **Learning outcomes:** Explain score and rank fusion strategies and why combining lexical and semantic retrieval can improve coverage.
- **Applied exercises:** Build a hybrid retriever that fuses lexical and dense results using a documented strategy. The submission must demonstrate measurable improvement over each individual retriever and analysis of queries that still fail.

- **Required reading:** _Building LLMs for Production_, Chapter 9, "Advanced RAG".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 9, "RAG Inference Pipeline".

### 5.8 Retrieval reranking

- **Learning outcomes:** Explain the role of rerankers, the difference between bi-encoders and cross-encoders, and their latency-quality tradeoff.
- **Applied exercises:** Add a reranker to the hybrid pipeline and benchmark quality, latency and cost before and after. The submission must demonstrate that the extra stage earns its operational cost.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 9, "RAG Inference Pipeline".
- **Technical references:** [Sentence Transformers retrieve and rerank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html).

### 5.9 Grounded generation and citation

- **Learning outcomes:** Explain grounded generation, faithfulness, citation alignment and the conditions that require a system to refuse an answer.
- **Applied exercises:** Build an answer generator that cites exact source passages and refuses unsupported questions. The submission must demonstrate claim-to-source alignment and make evidence easy for a user to inspect.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".

### 5.10 RAG evaluation

- **Learning outcomes:** Separate retrieval quality from generation quality and explain the metrics needed to diagnose each layer independently.
- **Applied exercises:** Build an evaluation report covering Recall@k, MRR, relevance, faithfulness, answer correctness and citation correctness. The submission must identify failure sources and required component changes.

- **Required reading:** _Hands-On Large Language Models_, Chapter 8, "Semantic Search and Retrieval-Augmented Generation".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 7, "Evaluating LLMs".

## Module 6: Tool-Using AI Systems and Agents

**Module aim:** Examine the architecture and implementation of tool-using workflows, stateful agents and Model Context Protocol integrations.

**Module learning outcomes:** Explain tool calling, agent control loops, workflow state, memory, failure recovery and secure MCP integration across deterministic and autonomous architectures.

**Module practical assessment:** An auditable business automation with constrained tools, durable state, retries, human approval and selected capabilities exposed through a secured MCP server.

### 6.1 Tool and function calling

- **Learning outcomes:** Explain tool schemas, model-selected arguments, validation and the security boundary between model intent and code execution.
- **Applied exercises:** Build one safe, read-only tool with a narrow schema, server-side validation and structured results. The submission must demonstrate that model-generated arguments are treated as untrusted input.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** _Building LLMs for Production_, Chapter 10, "Agents".
- **Technical references:** [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling) and [Anthropic tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview).

### 6.2 Tool interface design

- **Learning outcomes:** Explain how tool granularity, descriptions, idempotency and predictable outputs affect an agent’s reliability.
- **Applied exercises:** Build a small set of composable business tools rather than one broad tool. The submission must demonstrate clear responsibilities, useful error contracts, safe retry behaviour and descriptions that support correct tool selection.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** [OpenAI API documentation](https://platform.openai.com/docs/) and [Anthropic API documentation](https://docs.anthropic.com/).

### 6.3 Agent control-loop implementation

- **Learning outcomes:** Explain every step of a model-tool-result loop, including termination conditions, context updates and repeated calls.
- **Applied exercises:** Implement the agent loop directly without a framework, including validation, maximum steps and trace capture. The submission must demonstrate understanding of the control flow that frameworks later abstract.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 7, "Advanced Text Generation Techniques and Tools".

### 6.4 Workflow and agent architectures

- **Learning outcomes:** Distinguish deterministic workflows from autonomous agents and justify the simplest orchestration that satisfies the task.
- **Applied exercises:** Build deterministic and agentic versions of the same business process, then compare them for reliability, latency, cost and flexibility. The submission must demonstrate a reasoned architecture decision.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".

### 6.5 Workflow state and checkpointing

- **Learning outcomes:** Explain workflow state, checkpoints and durable execution, including why state must live outside the context window.
- **Applied exercises:** Add persisted task state and resumable checkpoints to the workflow. The submission must demonstrate recovery after process interruption without repeating completed side effects.

- **Required reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 7, "Advanced Text Generation Techniques and Tools".

### 6.6 Agent planning and memory

- **Learning outcomes:** Distinguish working context, durable memory, retrieved knowledge and plans, including their lifecycle and privacy implications.
- **Applied exercises:** Build separate stores and policies for current-task state, reusable knowledge and user-approved memory. The submission must demonstrate intentional retrieval, expiry and avoidance of accidental long-term storage.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 8, "Conversational Agency"; Chapter 9, "LLM Workflows".

### 6.7 Agent reliability and human oversight

- **Learning outcomes:** Explain retries, timeouts, idempotency, compensating actions and human approval as controls for agent failure.
- **Applied exercises:** Build fault-injection scenarios for invalid arguments, timeouts, duplicate execution, partial completion and unsafe actions. The submission must demonstrate recovery, auditability and approval before consequential operations.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 6, "RAG and Agents".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 11, "The Human Side of Machine Learning".

### 6.8 MCP architecture and capability model

- **Learning outcomes:** Explain the roles of MCP hosts, clients and servers across local and remote connections. Describe tools, resources, prompts, capability discovery, request lifecycles, notifications, subscriptions and security boundaries. Contrast MCP with ordinary model function calling.
- **Applied exercises:** Build an MCP server with one resource, one read-only tool, one state-changing tool and one reusable prompt. Connect the server to an MCP host. Inspect messages for discovery, listing, resource access and tool execution against the current specification.

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
- **Applied exercises:** Harden the MCP server with schema validation, authentication, per-tool permissions and confirmation for destructive actions. Add timeouts, cancellation and structured audit logs. Test unauthorised access and malicious inputs.

- **Required reading:**
  - [Official MCP server tutorial](https://modelcontextprotocol.io/docs/develop/build-server).
  - [Current MCP specification](https://modelcontextprotocol.io/specification/latest).
- **Technical references:**
  - [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices).
  - [MCP authorisation guide](https://modelcontextprotocol.io/docs/tutorials/security/authorization).
- **Further reading:** _Learn Model Context Protocol with Python_ by Christoffer Noring.

### 6.10 Agent frameworks

- **Learning outcomes:** Explain the state, node, edge and execution abstractions provided by an agent framework and what they replace.
- **Applied exercises:** Rebuild the manual loop with LangGraph or an equivalent framework while preserving tests and traces. The submission must demonstrate understanding of the framework’s value and costs rather than framework-driven design.

- **Required reading:** [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview).
- **Recommended reading:** _Prompt Engineering for LLMs_, Chapter 9, "LLM Workflows".
- **Technical references:** [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview).

## Module 7: Data Engineering and Systems Design

**Module aim:** Develop systems-design knowledge for reliable data storage, schema evolution, background processing and data movement.

**Module learning outcomes:** Evaluate AI products as distributed data systems with explicit reliability, scalability, compatibility, storage and processing requirements.

**Module practical assessment:** An extended portfolio system with documented non-functional requirements, evolvable schemas, background processing and a recoverable data pipeline.

### 7.1 Non-functional requirements

- **Learning outcomes:** Translate product expectations into measurable latency, reliability, scalability, maintainability and evolvability requirements.
- **Applied exercises:** Build an architecture requirements document with service-level targets and verify selected targets with load or failure tests. The submission must demonstrate that architecture choices follow measurable constraints.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 2, "Defining Nonfunctional Requirements".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 2, "Introduction to Machine Learning Systems Design".

### 7.2 Data modelling

- **Learning outcomes:** Compare relational, document and event-oriented models and choose between them from access patterns and consistency needs.
- **Applied exercises:** Build and justify the data model for the RAG or agent project, including entities, relationships, constraints and access patterns. The submission must demonstrate deliberate modelling rather than storage chosen by familiarity.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 3, "Data Models and Query Languages".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".

### 7.3 Indexing and storage systems

- **Learning outcomes:** Explain how primary, secondary, full-text and vector indexes accelerate reads while adding storage and write costs.
- **Applied exercises:** Add and benchmark indexes for the project’s main transactional and retrieval queries. The submission must demonstrate query-plan interpretation and evidence-based indexing decisions.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 4, "Storage and Retrieval".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 4, "RAG Feature Pipeline".

### 7.4 API and schema evolution

- **Learning outcomes:** Explain backward and forward compatibility, schema versioning and safe rollout strategies for APIs and stored data.
- **Applied exercises:** Introduce a deliberately breaking schema requirement, then implement a compatible migration and rollout. The submission must demonstrate support for old and new clients during transition.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 5, "Encoding and Evolution".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed.:
  - Chapter 3, "Developing a RESTful API with FastAPI".
  - Chapter 4, "Managing Pydantic Data Models in FastAPI".

### 7.5 Batch and background processing

- **Learning outcomes:** Explain queues, workers, retries, scheduling and idempotency for work unsuitable for a request-response cycle.
- **Applied exercises:** Move ingestion or evaluation into a background worker with progress, retry and dead-letter handling. The submission must demonstrate responsive APIs and safe execution of long-running jobs.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 11, "Batch Processing".
- **Recommended reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 14, "Creating a Distributed Text-to-Image AI System".

### 7.6 Stream and event processing

- **Learning outcomes:** Explain event time, ordering, delivery guarantees and consumer state at a practical system-design level.
- **Applied exercises:** Build a small event-driven update flow with duplicate and out-of-order event tests. The submission must demonstrate idempotent consumers and explicit assumptions about delivery semantics.

- **Required reading:** _Designing Data-Intensive Applications_, 2nd ed., Chapter 12, "Stream Processing".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".

### 7.7 Data pipeline architecture

- **Learning outcomes:** Explain lineage, orchestration, validation, recovery and observability across a multi-stage data pipeline.
- **Applied exercises:** Build a traceable ingestion pipeline with stage-level validation, checkpoints and reprocessing controls. The submission must demonstrate that bad data can be located, corrected and replayed without rebuilding everything.

- **Required reading:** _Designing Machine Learning Systems_, Chapter 3, "Data Engineering Fundamentals".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 3, "Data Engineering"; Chapter 4, "RAG Feature Pipeline".

## Module 8: Production AI Engineering and LLM Operations

**Module aim:** Develop the operational, security and governance practices required for dependable production AI systems.

**Module learning outcomes:** Explain production controls for reliable and economical AI workloads. Assess responsible-AI concerns and test AI-specific security risks.

**Module practical assessment:** A production-hardened AI system with deployment automation, telemetry, cost controls, guardrails, responsible-AI controls and automated security regression tests.

### 8.1 Containerised application delivery

- **Learning outcomes:** Explain image layers, build reproducibility, runtime configuration and the security boundary created by a container.
- **Applied exercises:** Build small, non-root production images for the API and worker with reproducible dependencies. The submission must demonstrate secure defaults, fast rebuilds and environment-independent execution.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 10, "Deploying a FastAPI Project".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".
- **Technical references:** [Docker documentation](https://docs.docker.com/).

### 8.2 Cloud deployment architectures

- **Learning outcomes:** Compare real-time, asynchronous and batch deployment patterns and explain their scaling, networking and operational tradeoffs.
- **Applied exercises:** Deploy the system’s API, worker and data dependencies using appropriate managed services. The submission must demonstrate secure networking, independent scaling and a documented deployment topology.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 10, "Inference Pipeline Deployment".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 7, "Model Deployment and Prediction Service"; Chapter 10, "Infrastructure and Tooling for MLOps".

### 8.3 Continuous integration and delivery

- **Learning outcomes:** Explain how tests, evaluations, artefacts, environments, rollout strategies and rollback controls form a safe delivery pipeline.
- **Applied exercises:** Build a CI/CD pipeline that runs linting, tests, AI evaluations, image builds and staged deployment. The submission must demonstrate automated quality gates and a rehearsed rollback path.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 10, "Infrastructure and Tooling for MLOps".
- **Technical references:** [GitHub Actions documentation](https://docs.github.com/en/actions).

### 8.4 Structured application logging

- **Learning outcomes:** Explain structured logging, severity, correlation identifiers and how to avoid leaking sensitive data.
- **Applied exercises:** Add structured, correlated logs across HTTP requests, background jobs and model calls. The submission must demonstrate useful diagnosis while redacting prompts, credentials and personal information as required.

- **Required reading:** _Building Data Science Applications with FastAPI_, 2nd ed., Chapter 15, "Monitoring the Health and Performance of a Data Science System".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".

### 8.5 Distributed tracing and observability

- **Learning outcomes:** Explain how metrics, logs and traces work together to diagnose model, retrieval, tool and infrastructure behaviour.
- **Applied exercises:** Build end-to-end traces and dashboards covering retrieval, model calls, tools, tokens, cost, latency and errors. The submission must demonstrate that a slow or incorrect request can be investigated across service boundaries.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 8, "Data Distribution Shifts and Monitoring".
- **Technical references:** [OpenTelemetry documentation](https://opentelemetry.io/docs/) and [Prometheus documentation](https://prometheus.io/docs/introduction/overview/).

### 8.6 Performance and cost engineering

- **Learning outcomes:** Identify the main latency and cost drivers in an AI request and explain which optimisation lever addresses each one.
- **Applied exercises:** Build a repeatable performance and cost benchmark, apply one justified optimisation and report the tradeoff. The submission must demonstrate measurement before optimisation and protection of output quality.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 4, "Evaluate AI Systems"; Chapter 9, "Inference Optimization".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".

### 8.7 Caching and model routing

- **Learning outcomes:** Explain cache keys, invalidation, semantic caching and capability-based model routing, including their correctness risks.
- **Applied exercises:** Build a cache and model router with explicit eligibility rules, invalidation and telemetry. The submission must demonstrate lower cost or latency without returning stale, private or under-capable responses.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".

### 8.8 Responsible AI, privacy and fairness

- **Learning outcomes:** Explain how bias, privacy, explainability, accessibility and human oversight affect AI products. Identify people who may be harmed and recognise representation or measurement bias. Define acceptable and unacceptable uses. Minimise personal data, select evaluation criteria, require human review where needed and communicate limitations.
- **Applied exercises:** Create a responsible-AI assessment for the strongest portfolio project. Implement at least three resulting controls. Options include PII redaction, retention limits, human review, subgroup evaluation, visible uncertainty and a clear explanation of data use.

- **Required reading:**
  - _Artificial Intelligence: A Modern Approach_, Chapter 27, "Philosophy, Ethics, and Safety of AI".
  - _Designing Machine Learning Systems_, Chapter 11, particularly "Responsible AI".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapters 3 and 4.
- **Technical references:** [NIST AI Risk Management Framework: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence).

### 8.9 AI application guardrails

- **Learning outcomes:** Explain layered input, output and action guardrails, including what each layer can and cannot prevent.
- **Applied exercises:** Build input validation, output checks and action policies with adversarial tests. The submission must demonstrate defence in depth and safe failure when a guardrail is uncertain.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 11, "MLOps and LLMOps".

### 8.10 LLM and agent security testing

- **Learning outcomes:** Distinguish model safety, application security and infrastructure security. Explain prompt injection, data exfiltration, unsafe tool execution, excessive agency, denial-of-wallet attacks and malicious supply-chain components. Turn an LLM application threat model into repeatable tests.
- **Applied exercises:** Build an automated red-team suite for the agentic business automation project. Test direct and indirect injection, system-instruction disclosure, secret extraction, tool manipulation and unauthorised access. Test unapproved destructive actions, runaway execution, malicious RAG content and compromised or misleading MCP tool descriptions. Add mitigations and run the suite in CI.

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
- **Applied exercises:** Build a feedback-capture and review pipeline that connects production examples to evaluation cases. The submission must demonstrate consent-aware collection, useful metadata and human oversight before data affects the system.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 9, "Continual Learning and Test in Production".

## Module 9: Machine Learning Foundations

**Module aim:** Establish the statistical and algorithmic foundations of classical machine learning.

**Module learning outcomes:** Explain the classical machine-learning workflow, generalisation, evaluation metrics, optimisation and probability concepts used in learned systems.

**Module practical assessment:** A reproducible classical machine-learning experiment covering problem framing, data splitting, baseline construction, metric selection and error analysis.

### 9.1 Machine learning problem taxonomy

- **Learning outcomes:** Distinguish supervised, unsupervised and reinforcement learning and explain generalisation, overfitting, underfitting and common failure modes.
- **Applied exercises:** Build a short comparative experiment or notebook using representative supervised and unsupervised tasks. The submission must demonstrate correct problem classification and justification of the learning approach.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 1, "The Machine Learning Landscape".
- **Recommended reading:** _Machine Learning with PyTorch and Scikit-Learn_, Chapter 1, "Giving Computers the Ability to Learn from Data".

### 9.2 End-to-end machine learning workflow

- **Learning outcomes:** Explain problem framing, data splitting, leakage prevention, baselines, training and validation as one connected workflow.
- **Applied exercises:** Build an end-to-end tabular ML project with reproducible preprocessing, a baseline, training, validation and a held-out test. The submission must demonstrate a trustworthy process rather than only a high score.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 2, "End-to-End Machine Learning Project".
- **Recommended reading:** _Designing Machine Learning Systems_, Chapter 1, "Overview of Machine Learning Systems"; Chapter 2, "Introduction to Machine Learning Systems Design".

### 9.3 Classification metrics

- **Learning outcomes:** Explain accuracy, precision, recall, F1, ROC/AUC and confusion matrices, and choose metrics for imbalanced problems.
- **Applied exercises:** Build an interactive or notebook-based metric explorer that changes thresholds and class distributions. The submission must demonstrate how metric choice changes product decisions and error costs.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 3, "Classification".
- **Recommended reading:** _An Introduction to Statistical Learning with Applications in Python_, Chapter 4, "Classification".

### 9.4 Gradient descent and regularisation

- **Learning outcomes:** Explain how loss, gradients, learning rate and regularisation influence optimisation and generalisation.
- **Applied exercises:** Build a visual optimisation experiment that varies learning rate and regularisation strength. The submission must demonstrate convergence, instability, underfitting and overfitting from both curves and model behaviour.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 4, "Training Models".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 7, "Continuous Optimization".

### 9.5 Probability for machine learning

- **Learning outcomes:** Explain conditional probability, Bayes’ rule, expectation, variance and Gaussian distributions as tools for reasoning about uncertainty.
- **Applied exercises:** Build simulations for conditional probability, Bayesian updating and sampling distributions. The submission must connect mathematical expressions with observed outcomes and uncertainty.

- **Required reading:** _Mathematics for Machine Learning_, Chapter 6, "Probability and Distributions".
- **Recommended reading:** _An Introduction to Statistical Learning with Applications in Python_, Chapter 2, "Statistical Learning".

## Module 10: Deep Learning and Transformer Architectures

**Module aim:** Examine the computational foundations of neural networks, PyTorch and transformer-based language models.

**Module learning outcomes:** Explain neural-network learning and the integration of transformer components in autoregressive language models.

**Module practical assessment:** A small neural network and compact GPT implemented in PyTorch, with evidence covering tensors, backpropagation, attention, training and generation.

### 10.1 Neural networks and backpropagation

- **Learning outcomes:** Explain the forward pass, loss calculation, backpropagation and parameter updates in a neural network.
- **Applied exercises:** Build a small neural network and manually inspect or calculate gradients for a simple batch. The submission must demonstrate the complete path from input and prediction to loss and parameter update.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 9, "Introduction to Artificial Neural Networks".
- **Recommended reading:** _Mathematics for Machine Learning_, Chapter 5, "Vector Calculus".

### 10.2 PyTorch fundamentals

- **Learning outcomes:** Explain tensor shapes, autograd, modules, datasets, DataLoaders and train/evaluation modes in PyTorch.
- **Applied exercises:** Build a PyTorch classifier with a custom dataset, model module, training loop and saved checkpoint. The submission must demonstrate correct tensor handling and separation of training from evaluation.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 10, "Building Neural Networks with PyTorch".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Appendix A, "Introduction to PyTorch".
- **Technical references:** [PyTorch documentation](https://docs.pytorch.org/docs/stable/index.html).

### 10.3 Neural network training

- **Learning outcomes:** Explain batching, optimisation, validation, regularisation, checkpoints and the signals of underfitting or overfitting.
- **Applied exercises:** Build a controlled training experiment comparing at least two optimisation or regularisation choices. The submission must demonstrate interpretation of learning curves and selection based on validation evidence.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 11, "Training Deep Neural Networks".
- **Recommended reading:** _Deep Learning_, Chapters 6, 8 and 11: deep feedforward networks, optimisation and practical methodology.

### 10.4 Transformer architecture

- **Learning outcomes:** Explain the purpose and data flow of embeddings, positional information, attention, residual connections and feed-forward blocks.
- **Applied exercises:** Build a small transformer block and instrument its tensor shapes through a forward pass. The submission must demonstrate how the components preserve and transform sequence representations.

- **Required reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, "Transformers for Natural Language Processing and Chatbots".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".

### 10.5 Attention mechanisms

- **Learning outcomes:** Explain queries, keys, values, scaled dot-product attention, causal masking and multi-head attention.
- **Applied exercises:** Implement causal multi-head attention and test masking and output shapes. The submission must demonstrate mathematical understanding of attention rather than use of a high-level transformer component.

- **Required reading:** _Build a Large Language Model (From Scratch)_, Chapter 3, "Coding Attention Mechanisms".
- **Recommended reading:** _Hands-On Machine Learning with Scikit-Learn and PyTorch_, Chapter 15, "Transformers for Natural Language Processing and Chatbots".

### 10.6 Compact GPT implementation

- **Learning outcomes:** Explain how tokenisation, embeddings, transformer blocks, language-model loss and autoregressive generation form a GPT.
- **Applied exercises:** Build and train a tiny GPT on a small corpus, then generate text from it. The submission must demonstrate the full training and inference path while documenting the limitations of its scale and data.

- **Required reading:** _Build a Large Language Model (From Scratch)_, Chapter 4, "Implementing a GPT Model from Scratch to Generate Text".
- **Recommended reading:** _Hands-On Large Language Models_, Chapter 3, "Looking Inside Large Language Models".

## Module 11: Model Adaptation and Local Inference

**Module aim:** Develop evidence-based methods for model adaptation, quantisation and local inference.

**Module learning outcomes:** Evaluate fine-tuning requirements and explain dataset, adaptation, quantisation and model-serving tradeoffs.

**Module practical assessment:** A measured parameter-efficient fine-tuning experiment and local inference architecture with explicit quality, memory, latency and cost analysis.

### 11.1 Fine-tuning decision criteria

- **Learning outcomes:** Decide when fine-tuning is justified instead of prompting, retrieval, more context or a stronger base model.
- **Applied exercises:** Build a decision record for a real use case, including baseline evaluations for prompting and retrieval alternatives. The submission must demonstrate that fine-tuning follows evidence rather than novelty.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 7, "Finetuning".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 5, "Supervised Fine-Tuning".

### 11.2 Fine-tuning dataset engineering

- **Learning outcomes:** Explain how data quality, formatting, distribution, privacy and train-validation splits determine fine-tuning outcomes.
- **Applied exercises:** Build a versioned dataset pipeline that validates, deduplicates, formats and splits examples. The submission must demonstrate provenance, quality checks and prevention of train-evaluation leakage.

- **Required reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 8, "Dataset Engineering".
- **Recommended reading:** _LLM Engineer's Handbook_, Chapter 5, "Supervised Fine-Tuning".

### 11.3 Supervised fine-tuning

- **Learning outcomes:** Explain the supervised fine-tuning objective, training data format and how to measure improvement against a baseline.
- **Applied exercises:** Fine-tune a small model on a focused task and compare it with the untouched model using the same evaluation set. The submission must demonstrate measurable task improvement and honest reporting of regressions.

- **Required reading:** _Hands-On Large Language Models_, Chapter 12, "Fine-Tuning Generation Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Chapter 7, "Fine-Tuning to Follow Instructions".

### 11.4 Parameter-efficient fine-tuning with LoRA and QLoRA

- **Learning outcomes:** Explain low-rank adapters and how LoRA and QLoRA reduce memory and compute at the cost of constrained adaptation.
- **Applied exercises:** Run one parameter-efficient adaptation experiment and record trainable parameters, memory use, runtime and quality. The submission must demonstrate understanding of why adapters are more practical than full fine-tuning in many settings.

- **Required reading:** _Hands-On Large Language Models_, Chapter 12, "Fine-Tuning Generation Models".
- **Recommended reading:** _Build a Large Language Model (From Scratch)_, Appendix E, "Parameter-Efficient Fine-Tuning with LoRA".
- **Technical references:** [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/).

### 11.5 Quantisation and local inference

- **Learning outcomes:** Explain how reduced numerical precision changes memory use, throughput, latency and model quality.
- **Applied exercises:** Benchmark at least two quantisation levels on the same local model and evaluation set. The submission must demonstrate an evidence-based precision choice across memory, latency and quality.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization".
- **Recommended reading:** _Building LLMs for Production_, Chapter 12, "Deployment and Optimization".
- **Technical references:** [Hugging Face bitsandbytes documentation](https://huggingface.co/docs/transformers/quantization/bitsandbytes).

### 11.6 Model inference architecture

- **Learning outcomes:** Explain prefill, decoding, KV caching, batching, throughput, latency and autoscaling in a model-serving system.
- **Applied exercises:** Build an inference benchmark and architecture proposal for real-time, asynchronous and batch workloads. The submission must demonstrate capacity reasoning and explicit tradeoffs between responsiveness, utilisation and cost.

- **Required reading:** _LLM Engineer's Handbook_, Chapter 8, "Inference Optimization"; Chapter 9, "RAG Inference Pipeline"; Chapter 10, "Inference Pipeline Deployment".
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 9, "Inference Optimization".
- **Technical references:** [vLLM documentation](https://docs.vllm.ai/).

## Module 12: Capstone in AI Engineering

**Module aim:** Integrate the curriculum through the design, implementation and evaluation of a production-grade AI product.

**Module learning outcomes:** Synthesise product design, AI application engineering, backend development, evaluation, data systems and operations into defensible technical decisions.

**Module practical assessment:** A portfolio-ready full-stack AI product with a defined user workflow, retrieval or tools, evaluation, CI/CD, observability, security and technical documentation.

### 12.1 Product definition and architecture

- **Learning outcomes:** Frame an AI product around a real user outcome, explicit constraints, measurable success and defensible architecture decisions.
- **Applied exercises:** Build a product brief, architecture document and evaluation plan before implementation. The submission must demonstrate clear scope, user value, risks, alternatives and measurable acceptance criteria.

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
- **Applied exercises:** Build the complete product using Next.js, FastAPI, authentication, PostgreSQL, retrieval or tools and a model-provider layer. The submission must demonstrate coherent integration, resilient boundaries and a polished user workflow.

- **Required reading:** Source code, architecture decision records and notes from the strongest earlier curriculum projects.
- **Recommended reading:** [Next.js documentation](https://nextjs.org/docs) and [FastAPI documentation](https://fastapi.tiangolo.com/).
- **Technical references:** [Next.js documentation](https://nextjs.org/docs), [FastAPI documentation](https://fastapi.tiangolo.com/) and [PostgreSQL documentation](https://www.postgresql.org/docs/).

### 12.3 Product evaluation and operations

- **Learning outcomes:** Explain the evidence required to call an AI product reliable, observable, secure, deployable and maintainable.
- **Applied exercises:** Add automated evaluations, CI/CD, deployment, logs, traces, cost monitoring, security controls and feedback capture. The submission must demonstrate that product quality is measurable and operational failures are diagnosable.

- **Required reading:** The evaluation harness developed in Module 4, including its reference dataset, rubrics and regression reports.
- **Recommended reading:** _AI Engineering: Building Applications with Foundation Models_, Chapter 10, "AI Engineering Architecture and User Feedback".

### 12.4 Technical portfolio and case study

- **Learning outcomes:** Present technical decisions, alternatives, failures and measured results as a credible engineering narrative.
- **Applied exercises:** Build a public case study with `README.md`, `ARCHITECTURE.md`, `EVALUATION.md` and `SECURITY.md`, supported by diagrams and measured outcomes. The submission must demonstrate ownership, reflection and the ability to communicate senior-level engineering judgement.

- **Required reading:** The deployed application, evaluation reports, traces, diagrams and decision records.
- **Recommended reading:** The architecture decision records, system diagram, runbooks and evaluation reports.

## Completion requirements

A lesson is complete when the learner can explain the central concept and complete the applied exercises. Completion requires evidence such as code, tests, reports, traces or architecture decisions.

For chapters with wider scope, the named section is required and the remaining material is recommended. The full chapter becomes required when practical work exposes a knowledge gap.
