package com.apps.myqms.repository;

import com.apps.myqms.domain.KioskForm;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the KioskForm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KioskFormRepository extends JpaRepository<KioskForm, Long> {}
