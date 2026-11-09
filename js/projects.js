/**
 * Projects Interactive Filter & Search - Powered by jQuery
 */

$(document).ready(function () {
  'use strict';

  // Category Filtering
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');

    // Update active filter button
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    // Filter cards with smooth fade transition
    if (filter === 'all') {
      $('.project-card-wrapper').fadeIn(200);
    } else {
      $('.project-card-wrapper').hide();
      $(`.project-card-wrapper[data-category*="${filter}"]`).fadeIn(250);
    }

    // Update results counter
    const visibleCount = filter === 'all' 
      ? $('.project-card-wrapper').length 
      : $(`.project-card-wrapper[data-category*="${filter}"]`).length;

    $('#project-count-display').text(`${visibleCount} Projects Displayed`);
  });

  // Search input filter if present
  $('#project-search-input').on('keyup', function () {
    const query = $(this).val().toLowerCase().trim();
    
    $('.project-card-wrapper').each(function () {
      const cardText = $(this).text().toLowerCase();
      if (cardText.indexOf(query) !== -1) {
        $(this).fadeIn(150);
      } else {
        $(this).fadeOut(150);
      }
    });
  });
});
