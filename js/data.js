// Built-in course content: topics, starter flashcards and practice questions.
// Each question: { topic, q, choices: [...], answer: index, why }
window.COURSES = {
  python: {
    name: "Python Programming",
    icon: "🐍",
    blurb: "Syntax, data structures, functions, OOP, files and errors.",
    topics: [
      "Variables & data types",
      "Control flow (if / loops)",
      "Functions & scope",
      "Lists, tuples & dictionaries",
      "Strings & formatting",
      "File I/O",
      "Exceptions",
      "Classes & OOP",
      "Modules & imports",
      "Comprehensions"
    ],
    flashcards: [
      { topic: "Variables & data types", front: "What does type(3/2) return in Python 3?", back: "<class 'float'> — / is true division. Use // for floor division (3//2 == 1)." },
      { topic: "Lists, tuples & dictionaries", front: "Mutable vs. immutable: list, tuple, dict, str?", back: "Mutable: list, dict, set. Immutable: tuple, str, int, float, frozenset." },
      { topic: "Functions & scope", front: "What is the LEGB rule?", back: "Name lookup order: Local → Enclosing → Global → Built-in." },
      { topic: "Functions & scope", front: "Why avoid def f(x=[])?", back: "Default arguments are evaluated once, so the same list is shared across calls. Use x=None and create the list inside." },
      { topic: "Comprehensions", front: "Squares of even numbers 0–9 as a list comprehension?", back: "[n*n for n in range(10) if n % 2 == 0]" },
      { topic: "Exceptions", front: "Order of try / except / else / finally?", back: "try runs; except handles errors; else runs only if no exception; finally always runs." },
      { topic: "Classes & OOP", front: "What is self?", back: "The instance the method was called on; passed automatically as the first argument." },
      { topic: "File I/O", front: "Why use with open(...) as f?", back: "The context manager closes the file automatically, even if an error occurs." },
      { topic: "Strings & formatting", front: "f-string for a price with 2 decimals?", back: "f\"{price:.2f}\"" },
      { topic: "Modules & imports", front: "What does if __name__ == \"__main__\": do?", back: "Runs that block only when the file is executed directly, not when it's imported." }
    ],
    questions: [
      { topic: "Variables & data types", q: "What is the output of print(7 // 2)?", choices: ["3.5", "3", "4", "Error"], answer: 1, why: "// is floor division, so 7 // 2 is 3." },
      { topic: "Lists, tuples & dictionaries", q: "Which of these is immutable?", choices: ["list", "dict", "tuple", "set"], answer: 2, why: "Tuples can't be changed after creation." },
      { topic: "Control flow (if / loops)", q: "How many times does for i in range(2, 10, 3) loop?", choices: ["2", "3", "4", "8"], answer: 1, why: "It yields 2, 5, 8." },
      { topic: "Functions & scope", q: "Which keyword lets a function assign to a module-level variable?", choices: ["nonlocal", "static", "global", "extern"], answer: 2, why: "global binds the name at module scope; nonlocal is for enclosing function scopes." },
      { topic: "Exceptions", q: "Which block runs whether or not an exception occurs?", choices: ["else", "finally", "except", "raise"], answer: 1, why: "finally always runs." },
      { topic: "Classes & OOP", q: "Which method is the constructor/initializer?", choices: ["__new__ only", "__init__", "__self__", "__construct__"], answer: 1, why: "__init__ initializes a new instance." },
      { topic: "Strings & formatting", q: "What is 'hello'[1:4]?", choices: ["'hel'", "'ell'", "'ello'", "'ell o'"], answer: 1, why: "Slicing includes the start index and excludes the end: indices 1, 2, 3." },
      { topic: "Comprehensions", q: "What does {x: x*2 for x in range(3)} produce?", choices: ["[0, 2, 4]", "{0, 2, 4}", "{0: 0, 1: 2, 2: 4}", "Error"], answer: 2, why: "Curly braces with key: value make a dict comprehension." },
      { topic: "File I/O", q: "Which mode appends to a file without erasing it?", choices: ["'w'", "'r'", "'a'", "'x'"], answer: 2, why: "'a' opens for appending; 'w' truncates." },
      { topic: "Modules & imports", q: "from math import sqrt lets you call…", choices: ["math.sqrt(4)", "sqrt(4)", "both", "neither"], answer: 1, why: "Only the name sqrt is imported into your namespace, not math." }
    ]
  },

  mobile: {
    name: "Mobile App Projects",
    icon: "📱",
    blurb: "App lifecycle, UI layouts, navigation, storage, APIs and publishing.",
    topics: [
      "App lifecycle",
      "UI layouts & components",
      "Navigation & screens",
      "State management",
      "Local storage & databases",
      "Networking & REST APIs",
      "Permissions & security",
      "Testing & debugging",
      "UX & accessibility",
      "Publishing to app stores"
    ],
    flashcards: [
      { topic: "App lifecycle", front: "Android Activity lifecycle callbacks (in order)?", back: "onCreate → onStart → onResume → (running) → onPause → onStop → onDestroy." },
      { topic: "UI layouts & components", front: "Constraint vs. Linear layout?", back: "LinearLayout stacks children in one direction; ConstraintLayout positions views relative to each other/parent, giving flat, flexible hierarchies." },
      { topic: "Navigation & screens", front: "What is a navigation stack?", back: "Screens pushed on top of each other; Back pops the top screen to return to the previous one." },
      { topic: "State management", front: "What is 'state' in a UI framework?", back: "Data that can change over time and determines what the UI shows; changing it triggers a re-render." },
      { topic: "Local storage & databases", front: "Key-value storage vs. SQLite?", back: "Key-value (SharedPreferences/UserDefaults/AsyncStorage) for small settings; SQLite/Room/Core Data for structured, queryable data." },
      { topic: "Networking & REST APIs", front: "Why make network calls off the main/UI thread?", back: "Blocking the main thread freezes the UI (and Android throws NetworkOnMainThreadException)." },
      { topic: "Permissions & security", front: "What are runtime permissions?", back: "Dangerous permissions (camera, location, contacts) must be requested from the user while the app runs, not just declared in the manifest." },
      { topic: "UX & accessibility", front: "Minimum recommended touch target size?", back: "About 48×48 dp (Android) / 44×44 pt (iOS)." },
      { topic: "Testing & debugging", front: "Unit test vs. UI (instrumented) test?", back: "Unit tests check logic in isolation and run fast on the JVM/host; UI tests run on a device/emulator and simulate user interaction." },
      { topic: "Publishing to app stores", front: "What does app signing prove?", back: "That updates come from the same developer and the package hasn't been tampered with." }
    ],
    questions: [
      { topic: "App lifecycle", q: "Which Android callback runs when an Activity becomes visible and interactive?", choices: ["onCreate", "onStart", "onResume", "onPause"], answer: 2, why: "onResume is called right before the user can interact with the Activity." },
      { topic: "UI layouts & components", q: "Which widget efficiently displays a long scrolling list in Android?", choices: ["ScrollView", "RecyclerView", "TextView", "FrameLayout"], answer: 1, why: "RecyclerView recycles row views instead of creating one per item." },
      { topic: "Navigation & screens", q: "Pressing Back on a navigation stack usually…", choices: ["Closes the app", "Pops the current screen", "Pushes a new screen", "Reloads the screen"], answer: 1, why: "Back pops the top of the stack." },
      { topic: "Local storage & databases", q: "Best place to store a user's 'dark mode' toggle?", choices: ["Remote SQL server", "SQLite table", "Key-value preferences", "A text file in Downloads"], answer: 2, why: "Small settings belong in key-value storage." },
      { topic: "Networking & REST APIs", q: "Which HTTP method is typically used to create a resource?", choices: ["GET", "POST", "DELETE", "HEAD"], answer: 1, why: "POST creates; GET reads; PUT/PATCH update; DELETE removes." },
      { topic: "Networking & REST APIs", q: "Which data format do most REST APIs return?", choices: ["CSV", "JSON", "YAML", "Binary only"], answer: 1, why: "JSON is the de facto standard." },
      { topic: "Permissions & security", q: "Where should you NOT store an API secret?", choices: ["A backend server", "Hard-coded in the app binary", "A secure keystore", "Environment config on the server"], answer: 1, why: "App binaries can be decompiled." },
      { topic: "State management", q: "In React Native, which hook stores local component state?", choices: ["useEffect", "useState", "useRef", "useMemo"], answer: 1, why: "useState returns a value and a setter that triggers re-render." },
      { topic: "UX & accessibility", q: "What helps screen readers describe an image button?", choices: ["A bright color", "A content description / accessibility label", "A larger font", "An animation"], answer: 1, why: "Accessibility labels are read aloud by TalkBack/VoiceOver." },
      { topic: "Publishing to app stores", q: "Android apps are published to Google Play as…", choices: [".exe", ".ipa", ".aab (App Bundle)", ".dmg"], answer: 2, why: "Google Play requires Android App Bundles; .ipa is iOS." }
    ]
  },

  database: {
    name: "Intro to Database Structures",
    icon: "🗄️",
    blurb: "Relational model, ER diagrams, SQL, keys, normalization and transactions.",
    topics: [
      "Relational model",
      "ER diagrams",
      "Keys (primary, foreign, candidate)",
      "SQL SELECT & filtering",
      "Joins",
      "Aggregation & GROUP BY",
      "Normalization (1NF–3NF, BCNF)",
      "Indexes",
      "Transactions & ACID",
      "DDL vs. DML"
    ],
    flashcards: [
      { topic: "Keys (primary, foreign, candidate)", front: "Primary key vs. foreign key?", back: "A primary key uniquely identifies rows in its table; a foreign key references a primary key in another table to link records." },
      { topic: "Normalization (1NF–3NF, BCNF)", front: "1NF?", back: "Every column holds atomic values and there are no repeating groups." },
      { topic: "Normalization (1NF–3NF, BCNF)", front: "2NF?", back: "1NF + no partial dependency: every non-key attribute depends on the whole composite key." },
      { topic: "Normalization (1NF–3NF, BCNF)", front: "3NF?", back: "2NF + no transitive dependency: non-key attributes depend only on the key." },
      { topic: "Transactions & ACID", front: "What does ACID stand for?", back: "Atomicity, Consistency, Isolation, Durability." },
      { topic: "Joins", front: "INNER JOIN vs. LEFT JOIN?", back: "INNER returns only matching rows; LEFT returns all left-table rows, with NULLs where there's no match." },
      { topic: "Aggregation & GROUP BY", front: "WHERE vs. HAVING?", back: "WHERE filters rows before grouping; HAVING filters groups after aggregation." },
      { topic: "ER diagrams", front: "How is a many-to-many relationship implemented?", back: "With a junction (associative) table holding foreign keys to both tables." },
      { topic: "Indexes", front: "Trade-off of adding an index?", back: "Faster reads/lookups, but slower inserts/updates and extra storage." },
      { topic: "DDL vs. DML", front: "DDL vs. DML examples?", back: "DDL defines structure: CREATE, ALTER, DROP. DML manipulates data: SELECT, INSERT, UPDATE, DELETE." }
    ],
    questions: [
      { topic: "Keys (primary, foreign, candidate)", q: "Which constraint enforces referential integrity?", choices: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"], answer: 1, why: "A foreign key must match an existing referenced key (or be NULL)." },
      { topic: "SQL SELECT & filtering", q: "Which clause sorts results?", choices: ["GROUP BY", "SORT", "ORDER BY", "HAVING"], answer: 2, why: "ORDER BY col [ASC|DESC]." },
      { topic: "Joins", q: "Which join returns all rows from both tables, matched where possible?", choices: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], answer: 2, why: "FULL OUTER keeps unmatched rows from both sides." },
      { topic: "Aggregation & GROUP BY", q: "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5 returns…", choices: ["Employees with id > 5", "Departments with more than 5 employees", "The first 5 departments", "An error"], answer: 1, why: "HAVING filters the grouped results." },
      { topic: "Normalization (1NF–3NF, BCNF)", q: "A table where zip → city and id → zip violates which form?", choices: ["1NF", "2NF", "3NF", "None"], answer: 2, why: "city depends on id transitively through zip." },
      { topic: "Transactions & ACID", q: "'All or nothing' describes which ACID property?", choices: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: 0, why: "Atomicity: a transaction fully commits or fully rolls back." },
      { topic: "Transactions & ACID", q: "Which command undoes uncommitted changes?", choices: ["COMMIT", "ROLLBACK", "UNDO", "REVERT"], answer: 1, why: "ROLLBACK discards changes since the transaction began." },
      { topic: "ER diagrams", q: "In an ER diagram, a weak entity…", choices: ["Has no attributes", "Can't be identified without its owner entity", "Is always many-to-many", "Has two primary keys"], answer: 1, why: "Its key includes the owner's key (partial key + owner)." },
      { topic: "DDL vs. DML", q: "Which is a DDL statement?", choices: ["INSERT", "UPDATE", "ALTER TABLE", "SELECT"], answer: 2, why: "ALTER changes the schema." },
      { topic: "Indexes", q: "An index most directly speeds up…", choices: ["WHERE lookups on the indexed column", "INSERTs", "Dropping tables", "Backups"], answer: 0, why: "Indexes speed searches but add write overhead." }
    ]
  },

  finance: {
    name: "Financial Institutions",
    icon: "🏦",
    blurb: "Banks, the Fed, interest rates, money markets, regulation and risk.",
    topics: [
      "Role of financial intermediaries",
      "Commercial banks & balance sheets",
      "The Federal Reserve & monetary policy",
      "Interest rates & yield curve",
      "Money & capital markets",
      "Investment banks & securities firms",
      "Insurance & pension funds",
      "Credit unions & thrifts",
      "Bank regulation (FDIC, Basel)",
      "Risk management"
    ],
    flashcards: [
      { topic: "Role of financial intermediaries", front: "Why do financial intermediaries exist?", back: "They reduce transaction costs, information asymmetry (adverse selection, moral hazard), and provide liquidity and risk sharing." },
      { topic: "Commercial banks & balance sheets", front: "Bank assets vs. liabilities?", back: "Assets: loans, securities, reserves, cash. Liabilities: deposits, borrowings. Assets − Liabilities = bank capital." },
      { topic: "The Federal Reserve & monetary policy", front: "Main tools of the Fed?", back: "Open market operations, interest on reserve balances, the discount rate, and (historically) reserve requirements." },
      { topic: "The Federal Reserve & monetary policy", front: "Fed buys Treasury securities → effect?", back: "Bank reserves rise, money supply expands, short-term rates tend to fall (expansionary)." },
      { topic: "Interest rates & yield curve", front: "What does an inverted yield curve signal?", back: "Short-term rates exceed long-term rates; historically a predictor of recession." },
      { topic: "Interest rates & yield curve", front: "Bond prices vs. interest rates?", back: "Inverse relationship: when rates rise, existing bond prices fall." },
      { topic: "Money & capital markets", front: "Money market vs. capital market?", back: "Money market: debt maturing in < 1 year (T-bills, commercial paper). Capital market: longer-term debt and equity." },
      { topic: "Bank regulation (FDIC, Basel)", front: "FDIC standard deposit insurance limit?", back: "$250,000 per depositor, per insured bank, per ownership category." },
      { topic: "Risk management", front: "Name the major risks banks manage.", back: "Credit, interest-rate, liquidity, market, operational, and off-balance-sheet risk." },
      { topic: "Credit unions & thrifts", front: "How do credit unions differ from banks?", back: "Member-owned, not-for-profit cooperatives; insured by NCUA instead of FDIC." }
    ],
    questions: [
      { topic: "Role of financial intermediaries", q: "Borrowers hiding risky behavior after getting a loan is…", choices: ["Adverse selection", "Moral hazard", "Liquidity risk", "Diversification"], answer: 1, why: "Moral hazard happens after the transaction; adverse selection before." },
      { topic: "Commercial banks & balance sheets", q: "Which is a liability for a commercial bank?", choices: ["Loans", "Reserves", "Checkable deposits", "Treasury bills"], answer: 2, why: "Deposits are owed to customers." },
      { topic: "The Federal Reserve & monetary policy", q: "To fight inflation, the Fed would most likely…", choices: ["Buy bonds", "Lower the policy rate", "Raise the policy rate", "Print currency"], answer: 2, why: "Higher rates tighten credit and cool demand." },
      { topic: "Interest rates & yield curve", q: "If market rates rise, existing bond prices…", choices: ["Rise", "Fall", "Stay the same", "Double"], answer: 1, why: "Prices and yields move inversely." },
      { topic: "Money & capital markets", q: "Which is a money market instrument?", choices: ["30-year Treasury bond", "Common stock", "Treasury bill", "Corporate bond"], answer: 2, why: "T-bills mature in a year or less." },
      { topic: "Bank regulation (FDIC, Basel)", q: "The Basel Accords mainly set standards for…", choices: ["Deposit interest rates", "Bank capital requirements", "Stock exchange listings", "Credit card fees"], answer: 1, why: "Basel I/II/III define minimum capital and liquidity ratios." },
      { topic: "Investment banks & securities firms", q: "An investment bank buying an IPO's shares to resell them is…", choices: ["Underwriting", "Hedging", "Discounting", "Clearing"], answer: 0, why: "Underwriters take on the risk of selling new issues." },
      { topic: "Insurance & pension funds", q: "Pension funds mostly hold…", choices: ["Short-term loans", "Long-term assets like stocks and bonds", "Only cash", "Real estate loans only"], answer: 1, why: "Their liabilities are long-term and predictable." },
      { topic: "Risk management", q: "A bank funding long-term fixed loans with short-term deposits faces…", choices: ["Interest-rate risk", "Operational risk", "Currency risk", "No risk"], answer: 0, why: "If rates rise, funding costs rise faster than loan income." },
      { topic: "Credit unions & thrifts", q: "Credit union deposits are insured by…", choices: ["FDIC", "NCUA", "SEC", "OCC"], answer: 1, why: "The National Credit Union Administration insures credit unions." }
    ]
  }
};
