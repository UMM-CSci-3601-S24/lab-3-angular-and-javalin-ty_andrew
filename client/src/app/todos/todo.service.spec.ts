import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';


describe('TodoService', () => {

  const testTodos: Todo[] = [
    {
      _id: "58895985c1849992336c219b",
      owner: "Fry",
      status: false,
      body: "Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.",
      category: "video games"
    },
    {
      _id: "58895985ae3b752b124e7663",
      owner: "Fry",
      status: true,
      body: "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
      category: "homework"
    },
    {
      _id: "58895985186754887e0381f5",
      owner: "Blanche",
      status: true,
      body: "Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.",
      category: "software design"
    }
  ];
  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/users` when `getTodos()` is called with no parameters', () => {
      // Assert that the users we get from this call to getTodos()
      // should be our set of test todos. Because we're subscribing
      // to the result of getTodos(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodos) a few lines
      // down.
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });

    describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getTodos()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getTodos()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getUsers()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testTodos`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the users.
       */

      it('correctly calls api/todos with filter parameter \'incomplete\'', () => {
        todoService.getTodos({ status: 'incomplete' }).subscribe(
          todos => expect(todos).toEqual(testTodos.filter(todo => todo.status === false))
        );

        // Specify that (exactly) one request will be made to the specified URL with the status parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the status parameter was 'incomplete'
        expect(req.request.params.get('status')).toEqual('incomplete');

        req.flush(testTodos.filter(todo => todo.status === false));
      });

      it('correctly calls api/todos with filter parameter \'complete\'', () => {
        todoService.getTodos({ status: 'complete' }).subscribe(
          todos => expect(todos).toEqual(testTodos.filter(todo => todo.status === true))
        );

        // Specify that (exactly) one request will be made to the specified URL with the status parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the status parameter was 'complete'
        expect(req.request.params.get('status')).toEqual('complete');

        req.flush(testTodos.filter(todo => todo.status === true));
      });

      it('correctly calls api/todos with filter parameter \'category\'', () => {
        todoService.getTodos({ category: 'video games' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the category parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('category')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the category parameter was 'Personal'
        expect(req.request.params.get('category')).toEqual('video games');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with multiple filter parameters', () => {
        todoService.getTodos({ status: 'incomplete', body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.'
        , owner: 'Fry', category: 'video games' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );
        // Specify that (exactly) one request will be made to the specified URL with the status parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl)
            && request.params.has('status') && request.params.has('body') && request.params.has('owner') && request.params.has('category')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the status, body, owner, and category parameters are correct
        expect(req.request.params.get('status')).toEqual('incomplete');
        expect(req.request.params.get('body')).toEqual('Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.');
        expect(req.request.params.get('owner')).toEqual('Fry');
        expect(req.request.params.get('category')).toEqual('video games');

        req.flush(testTodos);
      });
    });
  });

  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // We're just picking a Todo "at random" from our
      // set of Todos up at the top.
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
          // Since the `targetTodo`
          // is what the mock `HttpClient` returns in the
          // `req.flush(targetTodo)` line below, this
          // really just confirms that `getTodoById()`
          // doesn't in some way modify the todo it
          // gets back from the server.
          todo => expect(todo).toBe(targetTodo)
     );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterTodos()', () => {

    /*
      * Since `filterTodos` actually filters "locally" (in
      * Angular instead of on the server), we do want to
      * confirm that everything it returns has the desired
      * properties. Since this doesn't make a call to the server,
      * though, we don't have to use the mock HttpClient and
      * all those complications.
      */

    it('filters by owner', () => {
      const ownerName = 'y';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: ownerName });
      // There should be two users with an 'y' in their
      // name: Fry and Fry
      expect(filteredTodos.length).toBe(2);
      // Every returned todo's owner should contain an 'y'
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(ownerName)).toBeGreaterThanOrEqual(0);
    });
  });

    it('filters by status', () => {
      const todoStatus = false;
      const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's status should contain 'incomplete'
      filteredTodos.forEach(todo => {
        expect(todo.status).toBe(false);
    });
  });

    it('filters by owner and status', () => {
      const ownerName = 'y';
      const todoStatus = false;
      const filters = { owner: ownerName, status: todoStatus };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      expect(filteredTodos.length).toBe(1);
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(ownerName)).toBeGreaterThanOrEqual(0);
        expect(todo.status).toBe(false);
      });
    });
  });
});
