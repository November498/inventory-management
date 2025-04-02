import React, { useState } from "react";

const Filter = ({ items }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilterDropdown = () => setShowFilter(!showFilter);

  const handleAvailabilityChange = (e) => setAvailabilityFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.product.toLowerCase().includes(searchTerm);
    const matchesAvailability =
      availabilityFilter === "" || product.status === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  return <div>Filter</div>;
};

export default Filter;
