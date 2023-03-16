package com.apps.myqms.domain;

import com.apps.myqms.domain.enumeration.CissType;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KioskForm.
 */
@Entity
@Table(name = "kiosk_form")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KioskForm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "cfname", nullable = false)
    private String cfname;

    @NotNull
    @Size(min = 3)
    @Column(name = "clname", nullable = false)
    private String clname;

    @NotNull
    @Column(name = "ccinf", nullable = false)
    private Integer ccinf;

    @NotNull
    @Column(name = "customeraddress", nullable = false)
    private String customeraddress;

    @NotNull
    @Column(name = "issuestartdate", nullable = false)
    private Instant issuestartdate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "issuetype", nullable = false)
    private CissType issuetype;

    @Lob
    @Column(name = "issue_detail", nullable = false)
    private String issueDetail;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KioskForm id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCfname() {
        return this.cfname;
    }

    public KioskForm cfname(String cfname) {
        this.setCfname(cfname);
        return this;
    }

    public void setCfname(String cfname) {
        this.cfname = cfname;
    }

    public String getClname() {
        return this.clname;
    }

    public KioskForm clname(String clname) {
        this.setClname(clname);
        return this;
    }

    public void setClname(String clname) {
        this.clname = clname;
    }

    public Integer getCcinf() {
        return this.ccinf;
    }

    public KioskForm ccinf(Integer ccinf) {
        this.setCcinf(ccinf);
        return this;
    }

    public void setCcinf(Integer ccinf) {
        this.ccinf = ccinf;
    }

    public String getCustomeraddress() {
        return this.customeraddress;
    }

    public KioskForm customeraddress(String customeraddress) {
        this.setCustomeraddress(customeraddress);
        return this;
    }

    public void setCustomeraddress(String customeraddress) {
        this.customeraddress = customeraddress;
    }

    public Instant getIssuestartdate() {
        return this.issuestartdate;
    }

    public KioskForm issuestartdate(Instant issuestartdate) {
        this.setIssuestartdate(issuestartdate);
        return this;
    }

    public void setIssuestartdate(Instant issuestartdate) {
        this.issuestartdate = issuestartdate;
    }

    public CissType getIssuetype() {
        return this.issuetype;
    }

    public KioskForm issuetype(CissType issuetype) {
        this.setIssuetype(issuetype);
        return this;
    }

    public void setIssuetype(CissType issuetype) {
        this.issuetype = issuetype;
    }

    public String getIssueDetail() {
        return this.issueDetail;
    }

    public KioskForm issueDetail(String issueDetail) {
        this.setIssueDetail(issueDetail);
        return this;
    }

    public void setIssueDetail(String issueDetail) {
        this.issueDetail = issueDetail;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KioskForm)) {
            return false;
        }
        return id != null && id.equals(((KioskForm) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KioskForm{" +
            "id=" + getId() +
            ", cfname='" + getCfname() + "'" +
            ", clname='" + getClname() + "'" +
            ", ccinf=" + getCcinf() +
            ", customeraddress='" + getCustomeraddress() + "'" +
            ", issuestartdate='" + getIssuestartdate() + "'" +
            ", issuetype='" + getIssuetype() + "'" +
            ", issueDetail='" + getIssueDetail() + "'" +
            "}";
    }
}
