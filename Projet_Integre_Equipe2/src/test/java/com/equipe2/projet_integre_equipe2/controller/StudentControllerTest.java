package com.equipe2.projet_integre_equipe2.controller;

import com.equipe2.projet_integre_equipe2.model.Offer;
import com.equipe2.projet_integre_equipe2.model.Student;
import com.equipe2.projet_integre_equipe2.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(StudentController.class)
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    private Student student;
    private Student invalidCvStudent;

    @BeforeEach
    void setup(){
        student = Student.studentBuilder()
                .id(1)
                .firstName("Toto")
                .lastName("Tata")
                .matricule("1234567")
                .password("1234")
                .isCvValid(true)
                .build();
        invalidCvStudent = Student.studentBuilder()
                .id(5)
                .firstName("Toto")
                .lastName("Tata")
                .matricule("7654321")
                .password("1234")
                .isCvValid(false)
                .build();
    }

    @Test
    public void registerStudentTest() throws Exception {
        when(studentService.registerStudent(student)).thenReturn(Optional.of(student));

        MvcResult result = mockMvc.perform(post("/students/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(student))).andReturn();

        var actualStudent = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Student.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
        assertThat(student).isEqualTo(actualStudent);
    }

    @Test
    public void loginStudentTest() throws Exception{
        when(studentService.loginStudent(student.getMatricule(), student.getPassword())).thenReturn(Optional.of(student));

        MvcResult result = mockMvc.perform(get("/students/1234567/1234")
                .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        var actualStudent = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Student.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actualStudent).isEqualTo(student);
    }

    @Test
    public void getAllStudentsTest() throws Exception {
        List<Student> studentList = getListOfStudents();
        when(studentService.getAllStudents()).thenReturn(Optional.of(studentList));

        MvcResult result = mockMvc.perform(get("/students/get-all-students")
                .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        var actuals = new ObjectMapper().readValue(result.getResponse().getContentAsString(), List.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actuals.size()).isEqualTo(3);
    }

    @Test
    public void isValidCvStudentExist() throws Exception {
        when(studentService.isValidCvStudent(student.getMatricule())).thenReturn(Optional.of(true));
        MvcResult result = mockMvc.perform(get("/students/valid-cv/"+student.getMatricule())
                .contentType(MediaType.APPLICATION_JSON)).andReturn();
        var actualIsValidCvStudentExist = new ObjectMapper().readValue(result
                .getResponse().getContentAsString(), Boolean.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actualIsValidCvStudentExist).isEqualTo(true);
    }

    @Test
    public void isValidCvStudentExistFails() throws Exception {
        when(studentService.isValidCvStudent(invalidCvStudent.getMatricule())).thenReturn(Optional.of(false));
        MvcResult result = mockMvc.perform(get("/students/valid-cv/"+invalidCvStudent.getMatricule())
                .contentType(MediaType.APPLICATION_JSON)).andReturn();
        var actualIsValidCvStudentExist = new ObjectMapper().readValue(result
                .getResponse().getContentAsString(), Boolean.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actualIsValidCvStudentExist).isEqualTo(false);
    }

    @Test
    public void validateStudentTest() throws Exception {
        when(studentService.validateStudent(invalidCvStudent.getMatricule())).thenReturn(Optional.of(invalidCvStudent));

        MvcResult result = mockMvc.perform(put("/students/validate-student/7654321")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(invalidCvStudent))).andReturn();

        var actualStudent = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Student.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(invalidCvStudent).isEqualTo(actualStudent);
    }

    private List<Student> getListOfStudents() {
        List<Student> studentList = new ArrayList<>();
        studentList.add(Student.studentBuilder()
                .id(2)
                .firstName("Toto")
                .lastName("Tata")
                .matricule("1234567")
                .password("1234")
                .isCvValid(true)
                .build());
        studentList.add(Student.studentBuilder()
                .id(3)
                .firstName("Lolo")
                .lastName("Lala")
                .matricule("1234568")
                .password("1235")
                .isCvValid(false)
                .build());
        studentList.add(Student.studentBuilder()
                .id(4)
                .firstName("Lulu")
                .lastName("Tutu")
                .matricule("1234569")
                .password("1236")
                .isCvValid(true)
                .build());
        return studentList;
    }
}
