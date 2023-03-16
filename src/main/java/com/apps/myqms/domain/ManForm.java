package com.apps.myqms.domain;

import com.apps.myqms.domain.enumeration.ResolveType;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ManForm.
 */
@Entity
@Table(name = "man_form")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ManForm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "resolvetype", nullable = false)
    private ResolveType resolvetype;

    @Lob
    @Column(name = "resolvedetail", nullable = false)
    private String resolvedetail;

    @NotNull
    @Column(name = "resoldeddate", nullable = false)
    private Instant resoldeddate;

    @ManyToOne
    private User user;

    @ManyToOne
    private KioskForm kioskForm;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ManForm id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ResolveType getResolvetype() {
        return this.resolvetype;
    }

    public ManForm resolvetype(ResolveType resolvetype) {
        this.setResolvetype(resolvetype);
        return this;
    }

    public void setResolvetype(ResolveType resolvetype) {
        this.resolvetype = resolvetype;
    }

    public String getResolvedetail() {
        return this.resolvedetail;
    }

    public ManForm resolvedetail(String resolvedetail) {
        this.setResolvedetail(resolvedetail);
        return this;
    }

    public void setResolvedetail(String resolvedetail) {
        this.resolvedetail = resolvedetail;
    }

    public Instant getResoldeddate() {
        return this.resoldeddate;
    }

    public ManForm resoldeddate(Instant resoldeddate) {
        this.setResoldeddate(resoldeddate);
        return this;
    }

    public void setResoldeddate(Instant resoldeddate) {
        this.resoldeddate = resoldeddate;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ManForm user(User user) {
        this.setUser(user);
        return this;
    }

    public KioskForm getKioskForm() {
        return this.kioskForm;
    }

    public void setKioskForm(KioskForm kioskForm) {
        this.kioskForm = kioskForm;
    }

    public ManForm kioskForm(KioskForm kioskForm) {
        this.setKioskForm(kioskForm);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ManForm)) {
            return false;
        }
        return id != null && id.equals(((ManForm) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ManForm{" +
            "id=" + getId() +
            ", resolvetype='" + getResolvetype() + "'" +
            ", resolvedetail='" + getResolvedetail() + "'" +
            ", resoldeddate='" + getResoldeddate() + "'" +
            "}";
    }
}
