package app.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    @PostMapping
    public Bug createBug(@RequestBody Bug bug) {
        return bugRepository.save(bug);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        bugRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
