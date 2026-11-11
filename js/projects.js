/**
 * Projects Interactive Filter & Search - Powered by jQuery & Emil Kowalski physics
 */

$(document).ready(function () {
  'use strict';

  function filterProjects() {
    const filter = $('.filter-btn.active').data('filter') || 'all';
    const query = ($('#project-search-input').val() || '').toLowerCase().trim();
    const $cards = $('.myworks-card');

    let visibleCount = 0;

    $cards.each(function () {
      const $card = $(this);
      const category = ($card.attr('data-category') || '').toLowerCase();
      const cardText = $card.text().toLowerCase();

      const matchesCategory = filter === 'all' || category.indexOf(filter) !== -1;
      const matchesSearch = !query || cardText.indexOf(query) !== -1;

      if (matchesCategory && matchesSearch) {
        $card.stop(true, true).fadeIn(180);
        visibleCount++;
      } else {
        $card.stop(true, true).fadeOut(120);
      }
    });

    $('#project-result-count').text(`Showing ${visibleCount} of ${$cards.length} projects`);
  }

  // Category Filtering
  $('.filter-btn').on('click', function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    filterProjects();
  });

  // Search input filter
  $('#project-search-input').on('input', function () {
    filterProjects();
  });
});
