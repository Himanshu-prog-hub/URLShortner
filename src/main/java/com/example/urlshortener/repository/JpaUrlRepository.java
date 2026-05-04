package com.example.urlshortener.repository;

import java.lang.StackWalker.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.example.urlshortener.model.UrlMapping;

@Primary
@Repository
public class JpaUrlRepository implements UrlRepository{
    private final IUrlMappingJpaRepository repo;

    public JpaUrlRepository(IUrlMappingJpaRepository jpaRepo)
    {
        this.repo = jpaRepo; 
    }


    @Override
    public UrlMapping save(UrlMapping urlMapping)
    {
        return repo.save(urlMapping);
    }

    @Override
    public Optional<UrlMapping> findByShortCode(String shortCode)
    {
        return repo.findByShortCode(shortCode);
    }

    @Override
    public boolean existsByShortCode(String shortCode)
    {
        return repo.existsByShortCode(shortCode);
        
    }

    @Override
    public boolean deleteByShortCode(String shortCode)
    {
        long deleted = repo.deleteByShortCode(shortCode);
        return deleted>0;
    }

    @Override
    public void incrementClickCount(String shortCode)
    {
        repo.incrementClickCount(shortCode);
    }

    @Override
    public List<UrlMapping> findAll()
    {
        return repo.findAll();
    } 

    @Override
    public Optional<UrlMapping> findByLongUrl(String longUrl)
    {
        return repo.findByLongUrl(longUrl);

    }
}
