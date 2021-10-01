package com.equipe2.projet_integre_equipe2.controller;

import com.equipe2.projet_integre_equipe2.model.Monitor;

import com.equipe2.projet_integre_equipe2.model.Student;
import com.equipe2.projet_integre_equipe2.repository.MonitorRepository;
import com.equipe2.projet_integre_equipe2.service.MonitorService;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(MonitorController.class)
class MonitorControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private MonitorService monitorService;
    private Monitor monitor;
    private Monitor monitorDuplicateEmail;

    @BeforeEach
    void setup() {
        monitor = Monitor.monitorBuilder()
                .password("1234")
                .lastName("toto")
                .firstName("toto")
                .companyName("toto")
                .email("toto@toto")
                .build();

        monitorDuplicateEmail = Monitor.monitorBuilder()
                .firstName("tata")
                .lastName("toto")
                .email("toto@toto")
                .companyName("toto")
                .password("1234")
                .build();
    }

    @Test
    public void registerMonitorTest() throws Exception {
        when(monitorService.registerMonitor(monitor)).thenReturn(Optional.of(monitor));
        MvcResult result = getResult(monitor);
        var actualMonitor = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Monitor.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
        assertThat(monitor).isEqualTo(actualMonitor);
    }

    @Test
    public void registerMonitorDuplicateEmailTest() {
        when(monitorService.registerMonitor(any())).thenReturn(Optional.of(monitor)).thenReturn(Optional.empty());
        MvcResult result = null;
        MvcResult emptyResult = null;
        Monitor actualMonitor = null;
        Monitor actualDuplicate;
        try {
            result = getResult(monitor);
            emptyResult = getResult(monitorDuplicateEmail);
            actualMonitor = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Monitor.class);
            actualDuplicate = new ObjectMapper().readValue(emptyResult.getResponse().getContentAsString(), Monitor.class);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            actualDuplicate = null;
        }
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
        assertThat(actualMonitor).isEqualTo(monitor);
        assertThat(emptyResult.getResponse().getStatus()).isNotEqualTo(HttpStatus.CREATED.value());
        assertThat(actualDuplicate).isNull();
    }

    private MvcResult getResult(Monitor monitorDuplicateEmail) throws Exception {
        return mockMvc.perform(post("/monitors/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(monitorDuplicateEmail))).andReturn();
    }

    @Test
    public void monitorExistsByEmailTest() throws Exception {
        when(monitorService.monitorExistsByEmail(monitor.getEmail())).thenReturn(Optional.of(true));

        MvcResult result = mockMvc.perform(get("/monitors/monitorEmailExists/toto@toto")
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        var actualMonitor = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Boolean.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actualMonitor).isEqualTo(true);
    }

    @Test
    public void testLoginMonitor() throws Exception {
        when(monitorService.loginMonitor(monitor.getEmail(), monitor.getPassword())).thenReturn(Optional.of(monitor));

        MvcResult result = mockMvc.perform(get("/monitors/toto@toto/1234")
                .contentType(MediaType.APPLICATION_JSON)).andReturn();

        var actualMonitor = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Monitor.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actualMonitor).isEqualTo(monitor);
    }
}