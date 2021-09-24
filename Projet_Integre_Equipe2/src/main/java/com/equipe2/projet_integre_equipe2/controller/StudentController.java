<<<<<<< HEAD
//package com.equipe2.projet_integre_equipe2.controller;
//
//import com.equipe2.projet_integre_equipe2.model.Student;
//import com.equipe2.projet_integre_equipe2.repository.StudentRepository;
//import com.equipe2.projet_integre_equipe2.service.SystemService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:3000")
//public class StudentController {
//
//    @Autowired
//    StudentRepository studentRepository;
//
//    @Autowired
//    SystemService systemService;
//
//    @GetMapping("/projetIntegre/student/{matricule}/{password}")
//    public Student login(@PathVariable("matricule") String matricule, @PathVariable("password") String password){
//        return systemService.login(matricule,password);
//    }
//
//    @PostMapping(value = "/projetIntegre")
//    public Student subscribe(@RequestBody Student student) {
//        return systemService.subscribe(student);
//    }
//}
=======
package com.equipe2.projet_integre_equipe2.controller;

import com.equipe2.projet_integre_equipe2.model.Student;
import com.equipe2.projet_integre_equipe2.repository.StudentRepository;
import com.equipe2.projet_integre_equipe2.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

   @Autowired
   StudentRepository studentRepository;

   @Autowired
   SystemService systemService;

   @GetMapping("/projetIntegre/student/{matricule}/{password}")
   public Student login(@PathVariable("matricule") String matricule, @PathVariable("password") String password){
       return systemService.login(matricule,password);
   }

   @PostMapping
   public Student subscribe(@RequestBody Student student) {
       return systemService.subscribe(student);
   }
}
>>>>>>> deeec0b979de93c25e11817076372a4d64c0bc9e
