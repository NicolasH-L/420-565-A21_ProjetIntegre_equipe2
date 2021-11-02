package com.equipe2.projet_integre_equipe2.controller;

import com.equipe2.projet_integre_equipe2.model.Contract;
import com.equipe2.projet_integre_equipe2.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/contract")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping("/save-contract")
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        return contractService.saveContract(contract)
                .map(contract1 -> ResponseEntity.status(HttpStatus.CREATED).body(contract1))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).body(new Contract()));
    }

    @GetMapping("/get-contract/{id}")
    public ResponseEntity<Contract> getContractByStudent_id(@PathVariable Integer id){
        return contractService.getContractByStudentId(id)
                .map(contracts1 -> ResponseEntity.status(HttpStatus.OK).body(contracts1))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @GetMapping("/get-all-by-monitor/{id}")
    public ResponseEntity<List<Contract>> getContractsByMonitorId(@PathVariable Integer id){
        return contractService.getContractsByMonitorId(id)
                .map(contracts1 -> ResponseEntity.status(HttpStatus.OK).body(contracts1))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
