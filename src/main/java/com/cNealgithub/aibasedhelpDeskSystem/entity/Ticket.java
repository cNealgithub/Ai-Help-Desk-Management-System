package com.cNealgithub.aibasedhelpDeskSystem.entity;

import com.cNealgithub.aibasedhelpDeskSystem.entity.type.PriorityType;
import com.cNealgithub.aibasedhelpDeskSystem.entity.type.StatusType;
import jakarta.persistence.*;
import lombok.*;
import org.apache.tomcat.util.buf.UEncoder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "help_desk_tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String issue_summary;
    private String category;
    @Enumerated(EnumType.STRING)
    private PriorityType priority;
    @Enumerated(EnumType.STRING)
    private StatusType status;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
