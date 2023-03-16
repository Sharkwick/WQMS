package com.apps.myqms.web.rest;

import com.apps.myqms.domain.KioskForm;
import com.apps.myqms.repository.KioskFormRepository;
import com.apps.myqms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.apps.myqms.domain.KioskForm}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KioskFormResource {

    private final Logger log = LoggerFactory.getLogger(KioskFormResource.class);

    private static final String ENTITY_NAME = "kioskForm";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KioskFormRepository kioskFormRepository;

    public KioskFormResource(KioskFormRepository kioskFormRepository) {
        this.kioskFormRepository = kioskFormRepository;
    }

    /**
     * {@code POST  /kiosk-forms} : Create a new kioskForm.
     *
     * @param kioskForm the kioskForm to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kioskForm, or with status {@code 400 (Bad Request)} if the kioskForm has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kiosk-forms")
    public ResponseEntity<KioskForm> createKioskForm(@Valid @RequestBody KioskForm kioskForm) throws URISyntaxException {
        log.debug("REST request to save KioskForm : {}", kioskForm);
        if (kioskForm.getId() != null) {
            throw new BadRequestAlertException("A new kioskForm cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KioskForm result = kioskFormRepository.save(kioskForm);
        return ResponseEntity
            .created(new URI("/api/kiosk-forms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kiosk-forms/:id} : Updates an existing kioskForm.
     *
     * @param id the id of the kioskForm to save.
     * @param kioskForm the kioskForm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kioskForm,
     * or with status {@code 400 (Bad Request)} if the kioskForm is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kioskForm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kiosk-forms/{id}")
    public ResponseEntity<KioskForm> updateKioskForm(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody KioskForm kioskForm
    ) throws URISyntaxException {
        log.debug("REST request to update KioskForm : {}, {}", id, kioskForm);
        if (kioskForm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kioskForm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kioskFormRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KioskForm result = kioskFormRepository.save(kioskForm);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kioskForm.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /kiosk-forms/:id} : Partial updates given fields of an existing kioskForm, field will ignore if it is null
     *
     * @param id the id of the kioskForm to save.
     * @param kioskForm the kioskForm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kioskForm,
     * or with status {@code 400 (Bad Request)} if the kioskForm is not valid,
     * or with status {@code 404 (Not Found)} if the kioskForm is not found,
     * or with status {@code 500 (Internal Server Error)} if the kioskForm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/kiosk-forms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KioskForm> partialUpdateKioskForm(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody KioskForm kioskForm
    ) throws URISyntaxException {
        log.debug("REST request to partial update KioskForm partially : {}, {}", id, kioskForm);
        if (kioskForm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kioskForm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kioskFormRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KioskForm> result = kioskFormRepository
            .findById(kioskForm.getId())
            .map(existingKioskForm -> {
                if (kioskForm.getCfname() != null) {
                    existingKioskForm.setCfname(kioskForm.getCfname());
                }
                if (kioskForm.getClname() != null) {
                    existingKioskForm.setClname(kioskForm.getClname());
                }
                if (kioskForm.getCcinf() != null) {
                    existingKioskForm.setCcinf(kioskForm.getCcinf());
                }
                if (kioskForm.getCustomeraddress() != null) {
                    existingKioskForm.setCustomeraddress(kioskForm.getCustomeraddress());
                }
                if (kioskForm.getIssuestartdate() != null) {
                    existingKioskForm.setIssuestartdate(kioskForm.getIssuestartdate());
                }
                if (kioskForm.getIssuetype() != null) {
                    existingKioskForm.setIssuetype(kioskForm.getIssuetype());
                }
                if (kioskForm.getIssueDetail() != null) {
                    existingKioskForm.setIssueDetail(kioskForm.getIssueDetail());
                }

                return existingKioskForm;
            })
            .map(kioskFormRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kioskForm.getId().toString())
        );
    }

    /**
     * {@code GET  /kiosk-forms} : get all the kioskForms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kioskForms in body.
     */
    @GetMapping("/kiosk-forms")
    public List<KioskForm> getAllKioskForms() {
        log.debug("REST request to get all KioskForms");
        return kioskFormRepository.findAll();
    }

    /**
     * {@code GET  /kiosk-forms/:id} : get the "id" kioskForm.
     *
     * @param id the id of the kioskForm to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kioskForm, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kiosk-forms/{id}")
    public ResponseEntity<KioskForm> getKioskForm(@PathVariable Long id) {
        log.debug("REST request to get KioskForm : {}", id);
        Optional<KioskForm> kioskForm = kioskFormRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kioskForm);
    }

    /**
     * {@code DELETE  /kiosk-forms/:id} : delete the "id" kioskForm.
     *
     * @param id the id of the kioskForm to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kiosk-forms/{id}")
    public ResponseEntity<Void> deleteKioskForm(@PathVariable Long id) {
        log.debug("REST request to delete KioskForm : {}", id);
        kioskFormRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
