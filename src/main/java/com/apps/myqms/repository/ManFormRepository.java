package com.apps.myqms.repository;

import com.apps.myqms.domain.ManForm;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ManForm entity.
 */
@Repository
public interface ManFormRepository extends JpaRepository<ManForm, Long> {
    @Query("select manForm from ManForm manForm where manForm.user.login = ?#{principal.username}")
    List<ManForm> findByUserIsCurrentUser();

    default Optional<ManForm> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ManForm> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ManForm> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct manForm from ManForm manForm left join fetch manForm.user left join fetch manForm.kioskForm",
        countQuery = "select count(distinct manForm) from ManForm manForm"
    )
    Page<ManForm> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct manForm from ManForm manForm left join fetch manForm.user left join fetch manForm.kioskForm")
    List<ManForm> findAllWithToOneRelationships();

    @Query("select manForm from ManForm manForm left join fetch manForm.user left join fetch manForm.kioskForm where manForm.id =:id")
    Optional<ManForm> findOneWithToOneRelationships(@Param("id") Long id);
}
