package com.apps.myqms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.apps.myqms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KioskFormTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KioskForm.class);
        KioskForm kioskForm1 = new KioskForm();
        kioskForm1.setId(1L);
        KioskForm kioskForm2 = new KioskForm();
        kioskForm2.setId(kioskForm1.getId());
        assertThat(kioskForm1).isEqualTo(kioskForm2);
        kioskForm2.setId(2L);
        assertThat(kioskForm1).isNotEqualTo(kioskForm2);
        kioskForm1.setId(null);
        assertThat(kioskForm1).isNotEqualTo(kioskForm2);
    }
}
