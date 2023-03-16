package com.apps.myqms.web.rest;

import com.apps.myqms.domain.ManForm;
import com.apps.myqms.repository.ManFormRepository;
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
 * REST controller for managing {@link com.apps.myqms.domain.ManForm}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ManFormResource {

    private final Logger log = LoggerFactory.getLogger(ManFormResource.class);

    private static final String ENTITY_NAME = "manForm";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ManFormRepository manFormRepository;

    public ManFormResource(ManFormRepository manFormRepository) {
        this.manFormRepository = manFormRepository;
    }

    /**
     * {@code POST  /man-forms} : Create a new manForm.
     *
     * @param manForm the manForm to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new manForm, or with status {@code 400 (Bad Request)} if the manForm has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/man-forms")
    public ResponseEntity<ManForm> createManForm(@Valid @RequestBody ManForm manForm) throws URISyntaxException {
        log.debug("REST request to save ManForm : {}", manForm);
        if (manForm.getId() != null) {
            throw new BadRequestAlertException("A new manForm cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ManForm result = manFormRepository.save(manForm);
        return ResponseEntity
            .created(new URI("/api/man-forms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /man-forms/:id} : Updates an existing manForm.
     *
     * @param id the id of the manForm to save.
     * @param manForm the manForm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated manForm,
     * or with status {@code 400 (Bad Request)} if the manForm is not valid,
     * or with status {@code 500 (Internal Server Error)} if the manForm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/man-forms/{id}")
    public ResponseEntity<ManForm> updateManForm(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ManForm manForm
    ) throws URISyntaxException {
        log.debug("REST request to update ManForm : {}, {}", id, manForm);
        if (manForm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, manForm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!manFormRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ManForm result = manFormRepository.save(manForm);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, manForm.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /man-forms/:id} : Partial updates given fields of an existing manForm, field will ignore if it is null
     *
     * @param id the id of the manForm to save.
     * @param manForm the manForm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated manForm,
     * or with status {@code 400 (Bad Request)} if the manForm is not valid,
     * or with status {@code 404 (Not Found)} if the manForm is not found,
     * or with status {@code 500 (Internal Server Error)} if the manForm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/man-forms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ManForm> partialUpdateManForm(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ManForm manForm
    ) throws URISyntaxException {
        log.debug("REST request to partial update ManForm partially : {}, {}", id, manForm);
        if (manForm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, manForm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!manFormRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ManForm> result = manFormRepository
            .findById(manForm.getId())
            .map(existingManForm -> {
                if (manForm.getResolvetype() != null) {
                    existingManForm.setResolvetype(manForm.getResolvetype());
                }
                if (manForm.getResolvedetail() != null) {
                    existingManForm.setResolvedetail(manForm.getResolvedetail());
                }
                if (manForm.getResoldeddate() != null) {
                    existingManForm.setResoldeddate(manForm.getResoldeddate());
                }

                return existingManForm;
            })
            .map(manFormRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, manForm.getId().toString())
        );
    }

    /**
     * {@code GET  /man-forms} : get all the manForms.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of manForms in body.
     */
    @GetMapping("/man-forms")
    public List<ManForm> getAllManForms(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ManForms");
        if (eagerload) {
            return manFormRepository.findAllWithEagerRelationships();
        } else {
            return manFormRepository.findAll();
        }
    }

    /**
     * {@code GET  /man-forms/:id} : get the "id" manForm.
     *
     * @param id the id of the manForm to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the manForm, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/man-forms/{id}")
    public ResponseEntity<ManForm> getManForm(@PathVariable Long id) {
        log.debug("REST request to get ManForm : {}", id);
        Optional<ManForm> manForm = manFormRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(manForm);
    }

    /**
     * {@code DELETE  /man-forms/:id} : delete the "id" manForm.
     *
     * @param id the id of the manForm to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/man-forms/{id}")
    public ResponseEntity<Void> deleteManForm(@PathVariable Long id) {
        log.debug("REST request to delete ManForm : {}", id);
        manFormRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
