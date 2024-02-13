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

    describe('getTodos()', () => {

      it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
        todoService.getTodos().subscribe(
          users => expect(users).toBe(testTodos)
        );
        const req = httpTestingController.expectOne(todoService.todoUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Check that the request had no query parameters.
        expect(req.request.params.keys().length).toBe(0);
        req.flush(testTodos);
      });

    })

    describe('filterTodos()', () => {

      it('filters by owner', () => {
        const todoOwner = 'Fry';
        const filteredUsers = todoService.filterTodos(testTodos, { owner: todoOwner });
        expect(filteredUsers.length).toBe(2);
        filteredUsers.forEach(todo => {
          expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        })
      });

      it('filters by status true', () => {
        const todoStatus = true;
        const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
        expect(filteredTodos.length).toBe(2);
        filteredTodos.forEach(todo => {
          expect(todo.status === todoStatus);
        })
      });

      it('filters by status false', () => {
        const todoStatus = false;
        const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
        expect(filteredTodos.length).toBe(1);
        filteredTodos.forEach(todo => {
          expect(todo.status === todoStatus);
        })
      });


  });
});
})
