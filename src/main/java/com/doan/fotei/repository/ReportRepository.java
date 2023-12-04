package com.doan.fotei.repository;

import com.doan.fotei.domain.Report;
import com.doan.fotei.models.IUserReportStatistic;
import java.util.List;
import java.util.Set;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Report entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    Page<Report> findByStatus(String status, Pageable pageable);

    @Query("{ 'status' : ?0, 'post.userId': ?1 }")
    Page<Report> findByStatusAndPostUserId(String status, Long userId, Pageable pageable);

    @Aggregation(
        pipeline = {
            "{$group:{_id:{userId:'$post.userId'}, totalReport:{$sum:1}, totalReportApproved:{$sum:{$cond:{if:{$eq:['$status','approved']},then:1,else:0}}}}}",
            "{$project:{userId:'$_id.userId', totalReport:'$totalReport', totalReportApproved:'$totalReportApproved', _id: 0}}",
        }
    )
    List<IUserReportStatistic> getUserStatistic(Pageable pageable);

    @Aggregation(pipeline = { "{$group:{_id:'$post.userId', count:{$sum:1}}}", "{$count:'totalRecords'}" })
    IUserReportStatistic countUserStatistic();

    @Query("{ 'post._id' : ?0, '_id' : { $ne : ?1 } }")
    List<Report> findByPostIdAndIdNot(ObjectId postId, ObjectId id);
}
