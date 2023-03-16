package com.apps.myqms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apps.myqms.IntegrationTest;
import com.apps.myqms.domain.ManForm;
import com.apps.myqms.domain.enumeration.ResolveType;
import com.apps.myqms.repository.ManFormRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ManFormResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ManFormResourceIT {

    private static final ResolveType DEFAULT_RESOLVETYPE = ResolveType.Passed;
    private static final ResolveType UPDATED_RESOLVETYPE = ResolveType.Failed;

    private static final String DEFAULT_RESOLVEDETAIL = "AAAAAAAAAA";
    private static final String UPDATED_RESOLVEDETAIL = "BBBBBBBBBB";

    private static final Instant DEFAULT_RESOLDEDDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RESOLDEDDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/man-forms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ManFormRepository manFormRepository;

    @Mock
    private ManFormRepository manFormRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restManFormMockMvc;

    private ManForm manForm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ManForm createEntity(EntityManager em) {
        ManForm manForm = new ManForm()
            .resolvetype(DEFAULT_RESOLVETYPE)
            .resolvedetail(DEFAULT_RESOLVEDETAIL)
            .resoldeddate(DEFAULT_RESOLDEDDATE);
        return manForm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ManForm createUpdatedEntity(EntityManager em) {
        ManForm manForm = new ManForm()
            .resolvetype(UPDATED_RESOLVETYPE)
            .resolvedetail(UPDATED_RESOLVEDETAIL)
            .resoldeddate(UPDATED_RESOLDEDDATE);
        return manForm;
    }

    @BeforeEach
    public void initTest() {
        manForm = createEntity(em);
    }

    @Test
    @Transactional
    void createManForm() throws Exception {
        int databaseSizeBeforeCreate = manFormRepository.findAll().size();
        // Create the ManForm
        restManFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isCreated());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeCreate + 1);
        ManForm testManForm = manFormList.get(manFormList.size() - 1);
        assertThat(testManForm.getResolvetype()).isEqualTo(DEFAULT_RESOLVETYPE);
        assertThat(testManForm.getResolvedetail()).isEqualTo(DEFAULT_RESOLVEDETAIL);
        assertThat(testManForm.getResoldeddate()).isEqualTo(DEFAULT_RESOLDEDDATE);
    }

    @Test
    @Transactional
    void createManFormWithExistingId() throws Exception {
        // Create the ManForm with an existing ID
        manForm.setId(1L);

        int databaseSizeBeforeCreate = manFormRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restManFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isBadRequest());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkResolvetypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = manFormRepository.findAll().size();
        // set the field null
        manForm.setResolvetype(null);

        // Create the ManForm, which fails.

        restManFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isBadRequest());

        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkResoldeddateIsRequired() throws Exception {
        int databaseSizeBeforeTest = manFormRepository.findAll().size();
        // set the field null
        manForm.setResoldeddate(null);

        // Create the ManForm, which fails.

        restManFormMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isBadRequest());

        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllManForms() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        // Get all the manFormList
        restManFormMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(manForm.getId().intValue())))
            .andExpect(jsonPath("$.[*].resolvetype").value(hasItem(DEFAULT_RESOLVETYPE.toString())))
            .andExpect(jsonPath("$.[*].resolvedetail").value(hasItem(DEFAULT_RESOLVEDETAIL.toString())))
            .andExpect(jsonPath("$.[*].resoldeddate").value(hasItem(DEFAULT_RESOLDEDDATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllManFormsWithEagerRelationshipsIsEnabled() throws Exception {
        when(manFormRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restManFormMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(manFormRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllManFormsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(manFormRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restManFormMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(manFormRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getManForm() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        // Get the manForm
        restManFormMockMvc
            .perform(get(ENTITY_API_URL_ID, manForm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(manForm.getId().intValue()))
            .andExpect(jsonPath("$.resolvetype").value(DEFAULT_RESOLVETYPE.toString()))
            .andExpect(jsonPath("$.resolvedetail").value(DEFAULT_RESOLVEDETAIL.toString()))
            .andExpect(jsonPath("$.resoldeddate").value(DEFAULT_RESOLDEDDATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingManForm() throws Exception {
        // Get the manForm
        restManFormMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingManForm() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();

        // Update the manForm
        ManForm updatedManForm = manFormRepository.findById(manForm.getId()).get();
        // Disconnect from session so that the updates on updatedManForm are not directly saved in db
        em.detach(updatedManForm);
        updatedManForm.resolvetype(UPDATED_RESOLVETYPE).resolvedetail(UPDATED_RESOLVEDETAIL).resoldeddate(UPDATED_RESOLDEDDATE);

        restManFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedManForm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedManForm))
            )
            .andExpect(status().isOk());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
        ManForm testManForm = manFormList.get(manFormList.size() - 1);
        assertThat(testManForm.getResolvetype()).isEqualTo(UPDATED_RESOLVETYPE);
        assertThat(testManForm.getResolvedetail()).isEqualTo(UPDATED_RESOLVEDETAIL);
        assertThat(testManForm.getResoldeddate()).isEqualTo(UPDATED_RESOLDEDDATE);
    }

    @Test
    @Transactional
    void putNonExistingManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, manForm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(manForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(manForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateManFormWithPatch() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();

        // Update the manForm using partial update
        ManForm partialUpdatedManForm = new ManForm();
        partialUpdatedManForm.setId(manForm.getId());

        partialUpdatedManForm.resolvedetail(UPDATED_RESOLVEDETAIL).resoldeddate(UPDATED_RESOLDEDDATE);

        restManFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedManForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedManForm))
            )
            .andExpect(status().isOk());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
        ManForm testManForm = manFormList.get(manFormList.size() - 1);
        assertThat(testManForm.getResolvetype()).isEqualTo(DEFAULT_RESOLVETYPE);
        assertThat(testManForm.getResolvedetail()).isEqualTo(UPDATED_RESOLVEDETAIL);
        assertThat(testManForm.getResoldeddate()).isEqualTo(UPDATED_RESOLDEDDATE);
    }

    @Test
    @Transactional
    void fullUpdateManFormWithPatch() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();

        // Update the manForm using partial update
        ManForm partialUpdatedManForm = new ManForm();
        partialUpdatedManForm.setId(manForm.getId());

        partialUpdatedManForm.resolvetype(UPDATED_RESOLVETYPE).resolvedetail(UPDATED_RESOLVEDETAIL).resoldeddate(UPDATED_RESOLDEDDATE);

        restManFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedManForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedManForm))
            )
            .andExpect(status().isOk());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
        ManForm testManForm = manFormList.get(manFormList.size() - 1);
        assertThat(testManForm.getResolvetype()).isEqualTo(UPDATED_RESOLVETYPE);
        assertThat(testManForm.getResolvedetail()).isEqualTo(UPDATED_RESOLVEDETAIL);
        assertThat(testManForm.getResoldeddate()).isEqualTo(UPDATED_RESOLDEDDATE);
    }

    @Test
    @Transactional
    void patchNonExistingManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, manForm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(manForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(manForm))
            )
            .andExpect(status().isBadRequest());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamManForm() throws Exception {
        int databaseSizeBeforeUpdate = manFormRepository.findAll().size();
        manForm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restManFormMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(manForm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ManForm in the database
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteManForm() throws Exception {
        // Initialize the database
        manFormRepository.saveAndFlush(manForm);

        int databaseSizeBeforeDelete = manFormRepository.findAll().size();

        // Delete the manForm
        restManFormMockMvc
            .perform(delete(ENTITY_API_URL_ID, manForm.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ManForm> manFormList = manFormRepository.findAll();
        assertThat(manFormList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
