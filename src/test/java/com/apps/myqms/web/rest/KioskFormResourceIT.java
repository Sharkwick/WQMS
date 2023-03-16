package com.apps.myqms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apps.myqms.IntegrationTest;
import com.apps.myqms.domain.KioskForm;
import com.apps.myqms.domain.enumeration.CissType;
import com.apps.myqms.repository.KioskFormRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link KioskFormResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KioskFormResourceIT {

    private static final String DEFAULT_CFNAME = "AAAAAAAAAA";
    private static final String UPDATED_CFNAME = "BBBBBBBBBB";

    private static final String DEFAULT_CLNAME = "AAAAAAAAAA";
    private static final String UPDATED_CLNAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_CCINF = 1;
    private static final Integer UPDATED_CCINF = 2;

    private static final String DEFAULT_CUSTOMERADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_CUSTOMERADDRESS = "BBBBBBBBBB";

    private static final Instant DEFAULT_ISSUESTARTDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ISSUESTARTDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final CissType DEFAULT_ISSUETYPE = CissType.Hardware;
    private static final CissType UPDATED_ISSUETYPE = CissType.Software;

    private static final String DEFAULT_ISSUE_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_ISSUE_DETAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/kiosk-forms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KioskFormRepository kioskFormRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKioskFormMockMvc;

    private KioskForm kioskForm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KioskForm createEntity(EntityManager em) {
        KioskForm kioskForm = new KioskForm()
            .cfname(DEFAULT_CFNAME)
            .clname(DEFAULT_CLNAME)
            .ccinf(DEFAULT_CCINF)
            .customeraddress(DEFAULT_CUSTOMERADDRESS)
            .issuestartdate(DEFAULT_ISSUESTARTDATE)
            .issuetype(DEFAULT_ISSUETYPE)
            .issueDetail(DEFAULT_ISSUE_DETAIL);
        return kioskForm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KioskForm createUpdatedEntity(EntityManager em) {
        KioskForm kioskForm = new KioskForm()
            .cfname(UPDATED_CFNAME)
            .clname(UPDATED_CLNAME)
            .ccinf(UPDATED_CCINF)
            .customeraddress(UPDATED_CUSTOMERADDRESS)
            .issuestartdate(UPDATED_ISSUESTARTDATE)
            .issuetype(UPDATED_ISSUETYPE)
            .issueDetail(UPDATED_ISSUE_DETAIL);
        return kioskForm;
    }

    @BeforeEach
    public void initTest() {
        kioskForm = createEntity(em);
    }

    @Test
    @Transactional
    void createKioskForm() throws Exception {
        int databaseSizeBeforeCreate = kioskFormRepository.findAll().size();
        // Create the KioskForm
        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isCreated());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeCreate + 1);
        KioskForm testKioskForm = kioskFormList.get(kioskFormList.size() - 1);
        assertThat(testKioskForm.getCfname()).isEqualTo(DEFAULT_CFNAME);
        assertThat(testKioskForm.getClname()).isEqualTo(DEFAULT_CLNAME);
        assertThat(testKioskForm.getCcinf()).isEqualTo(DEFAULT_CCINF);
        assertThat(testKioskForm.getCustomeraddress()).isEqualTo(DEFAULT_CUSTOMERADDRESS);
        assertThat(testKioskForm.getIssuestartdate()).isEqualTo(DEFAULT_ISSUESTARTDATE);
        assertThat(testKioskForm.getIssuetype()).isEqualTo(DEFAULT_ISSUETYPE);
        assertThat(testKioskForm.getIssueDetail()).isEqualTo(DEFAULT_ISSUE_DETAIL);
    }

    @Test
    @Transactional
    void createKioskFormWithExistingId() throws Exception {
        // Create the KioskForm with an existing ID
        kioskForm.setId(1L);

        int databaseSizeBeforeCreate = kioskFormRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCfnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setCfname(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkClnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setClname(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCcinfIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setCcinf(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCustomeraddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setCustomeraddress(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIssuestartdateIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setIssuestartdate(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIssuetypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = kioskFormRepository.findAll().size();
        // set the field null
        kioskForm.setIssuetype(null);

        // Create the KioskForm, which fails.

        restKioskFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isBadRequest());

        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllKioskForms() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        // Get all the kioskFormList
        restKioskFormMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kioskForm.getId().intValue())))
            .andExpect(jsonPath("$.[*].cfname").value(hasItem(DEFAULT_CFNAME)))
            .andExpect(jsonPath("$.[*].clname").value(hasItem(DEFAULT_CLNAME)))
            .andExpect(jsonPath("$.[*].ccinf").value(hasItem(DEFAULT_CCINF)))
            .andExpect(jsonPath("$.[*].customeraddress").value(hasItem(DEFAULT_CUSTOMERADDRESS)))
            .andExpect(jsonPath("$.[*].issuestartdate").value(hasItem(DEFAULT_ISSUESTARTDATE.toString())))
            .andExpect(jsonPath("$.[*].issuetype").value(hasItem(DEFAULT_ISSUETYPE.toString())))
            .andExpect(jsonPath("$.[*].issueDetail").value(hasItem(DEFAULT_ISSUE_DETAIL.toString())));
    }

    @Test
    @Transactional
    void getKioskForm() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        // Get the kioskForm
        restKioskFormMockMvc
            .perform(get(ENTITY_API_URL_ID, kioskForm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kioskForm.getId().intValue()))
            .andExpect(jsonPath("$.cfname").value(DEFAULT_CFNAME))
            .andExpect(jsonPath("$.clname").value(DEFAULT_CLNAME))
            .andExpect(jsonPath("$.ccinf").value(DEFAULT_CCINF))
            .andExpect(jsonPath("$.customeraddress").value(DEFAULT_CUSTOMERADDRESS))
            .andExpect(jsonPath("$.issuestartdate").value(DEFAULT_ISSUESTARTDATE.toString()))
            .andExpect(jsonPath("$.issuetype").value(DEFAULT_ISSUETYPE.toString()))
            .andExpect(jsonPath("$.issueDetail").value(DEFAULT_ISSUE_DETAIL.toString()));
    }

    @Test
    @Transactional
    void getNonExistingKioskForm() throws Exception {
        // Get the kioskForm
        restKioskFormMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKioskForm() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();

        // Update the kioskForm
        KioskForm updatedKioskForm = kioskFormRepository.findById(kioskForm.getId()).get();
        // Disconnect from session so that the updates on updatedKioskForm are not directly saved in db
        em.detach(updatedKioskForm);
        updatedKioskForm
            .cfname(UPDATED_CFNAME)
            .clname(UPDATED_CLNAME)
            .ccinf(UPDATED_CCINF)
            .customeraddress(UPDATED_CUSTOMERADDRESS)
            .issuestartdate(UPDATED_ISSUESTARTDATE)
            .issuetype(UPDATED_ISSUETYPE)
            .issueDetail(UPDATED_ISSUE_DETAIL);

        restKioskFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKioskForm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKioskForm))
            )
            .andExpect(status().isOk());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
        KioskForm testKioskForm = kioskFormList.get(kioskFormList.size() - 1);
        assertThat(testKioskForm.getCfname()).isEqualTo(UPDATED_CFNAME);
        assertThat(testKioskForm.getClname()).isEqualTo(UPDATED_CLNAME);
        assertThat(testKioskForm.getCcinf()).isEqualTo(UPDATED_CCINF);
        assertThat(testKioskForm.getCustomeraddress()).isEqualTo(UPDATED_CUSTOMERADDRESS);
        assertThat(testKioskForm.getIssuestartdate()).isEqualTo(UPDATED_ISSUESTARTDATE);
        assertThat(testKioskForm.getIssuetype()).isEqualTo(UPDATED_ISSUETYPE);
        assertThat(testKioskForm.getIssueDetail()).isEqualTo(UPDATED_ISSUE_DETAIL);
    }

    @Test
    @Transactional
    void putNonExistingKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kioskForm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kioskForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kioskForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kioskForm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKioskFormWithPatch() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();

        // Update the kioskForm using partial update
        KioskForm partialUpdatedKioskForm = new KioskForm();
        partialUpdatedKioskForm.setId(kioskForm.getId());

        partialUpdatedKioskForm
            .cfname(UPDATED_CFNAME)
            .clname(UPDATED_CLNAME)
            .customeraddress(UPDATED_CUSTOMERADDRESS)
            .issuestartdate(UPDATED_ISSUESTARTDATE)
            .issueDetail(UPDATED_ISSUE_DETAIL);

        restKioskFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKioskForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKioskForm))
            )
            .andExpect(status().isOk());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
        KioskForm testKioskForm = kioskFormList.get(kioskFormList.size() - 1);
        assertThat(testKioskForm.getCfname()).isEqualTo(UPDATED_CFNAME);
        assertThat(testKioskForm.getClname()).isEqualTo(UPDATED_CLNAME);
        assertThat(testKioskForm.getCcinf()).isEqualTo(DEFAULT_CCINF);
        assertThat(testKioskForm.getCustomeraddress()).isEqualTo(UPDATED_CUSTOMERADDRESS);
        assertThat(testKioskForm.getIssuestartdate()).isEqualTo(UPDATED_ISSUESTARTDATE);
        assertThat(testKioskForm.getIssuetype()).isEqualTo(DEFAULT_ISSUETYPE);
        assertThat(testKioskForm.getIssueDetail()).isEqualTo(UPDATED_ISSUE_DETAIL);
    }

    @Test
    @Transactional
    void fullUpdateKioskFormWithPatch() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();

        // Update the kioskForm using partial update
        KioskForm partialUpdatedKioskForm = new KioskForm();
        partialUpdatedKioskForm.setId(kioskForm.getId());

        partialUpdatedKioskForm
            .cfname(UPDATED_CFNAME)
            .clname(UPDATED_CLNAME)
            .ccinf(UPDATED_CCINF)
            .customeraddress(UPDATED_CUSTOMERADDRESS)
            .issuestartdate(UPDATED_ISSUESTARTDATE)
            .issuetype(UPDATED_ISSUETYPE)
            .issueDetail(UPDATED_ISSUE_DETAIL);

        restKioskFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKioskForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKioskForm))
            )
            .andExpect(status().isOk());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
        KioskForm testKioskForm = kioskFormList.get(kioskFormList.size() - 1);
        assertThat(testKioskForm.getCfname()).isEqualTo(UPDATED_CFNAME);
        assertThat(testKioskForm.getClname()).isEqualTo(UPDATED_CLNAME);
        assertThat(testKioskForm.getCcinf()).isEqualTo(UPDATED_CCINF);
        assertThat(testKioskForm.getCustomeraddress()).isEqualTo(UPDATED_CUSTOMERADDRESS);
        assertThat(testKioskForm.getIssuestartdate()).isEqualTo(UPDATED_ISSUESTARTDATE);
        assertThat(testKioskForm.getIssuetype()).isEqualTo(UPDATED_ISSUETYPE);
        assertThat(testKioskForm.getIssueDetail()).isEqualTo(UPDATED_ISSUE_DETAIL);
    }

    @Test
    @Transactional
    void patchNonExistingKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kioskForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kioskForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kioskForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKioskForm() throws Exception {
        int databaseSizeBeforeUpdate = kioskFormRepository.findAll().size();
        kioskForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKioskFormMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(kioskForm))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KioskForm in the database
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKioskForm() throws Exception {
        // Initialize the database
        kioskFormRepository.saveAndFlush(kioskForm);

        int databaseSizeBeforeDelete = kioskFormRepository.findAll().size();

        // Delete the kioskForm
        restKioskFormMockMvc
            .perform(delete(ENTITY_API_URL_ID, kioskForm.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KioskForm> kioskFormList = kioskFormRepository.findAll();
        assertThat(kioskFormList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
