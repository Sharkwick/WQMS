package com.apps.myqms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.apps.myqms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ManFormTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ManForm.class);
        ManForm manForm1 = new ManForm();
        manForm1.setId(1L);
        ManForm manForm2 = new ManForm();
        manForm2.setId(manForm1.getId());
        assertThat(manForm1).isEqualTo(manForm2);
        manForm2.setId(2L);
        assertThat(manForm1).isNotEqualTo(manForm2);
        manForm1.setId(null);
        assertThat(manForm1).isNotEqualTo(manForm2);
    }
}
