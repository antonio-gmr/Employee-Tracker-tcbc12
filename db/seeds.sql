
INSERT INTO department (name)
VALUES ("Logistics"),
       ("Legal"),
       ("Marketing"),
       ("Accounting"),
       ('HR');

INSERT INTO roles (title, salary, department_id)
VALUES ("Logistics Analyst", 1000, 001),
       ("Logistics Manager", 3000, 001),
       ("LogisticsT Director", 6000, 001),
       ("Legal Analyst", 1000, 002),
       ("Legal Manager", 3000, 002),
       ("Legal Director", 6000, 002),
       ("Marketing analyst", 1500, 003),
       ("Marketing Manager", 5000, 003),
       ("MarketingDirector", 9000, 003),
       ("Accounting Analyst", 800, 004),
       ("Accounting Manager", 2500, 004),
       ("Accounting Director", 5500, 004),
       ("HR Analyst", 10000, 005),
       ("HR Manager", 10000, 005),
       ("HR Director", 12000, 005);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James.", 'Mclon', 13, NULL),
       ("David", 'Lloyd', 14, NULL),
       ("Ron", 'Joil', 15, NULL),
        --  Legal Team
       ("Carlos", 'Lopi', 3, 3),
       ("Ramon", 'Canterias', 2, 4),
       ("Eduardo", 'Chuan', 1, 5),
          --  Legal Team
       ("Raquel", "Martinez", 6, 3),
       ("Sara", "Lopez", 5, 7),
       ("Nefertari", "Vivi", 4, 8),
      --   IT Team
       ("Eduardo", 'Salinas', 9, 3),  
       ("Raquel", 'Martinez', 8, 10), 
       ("Sara", 'Luki', 7, 11), 
        -- HR Team
       ("Mariano", 'Lopo', 12, 3),
       ("Joel", 'Kurmo', 11, 13), 
       ('Nico', 'Robin', 10, 14);

