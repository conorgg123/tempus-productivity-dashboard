import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * A card component for displaying statistics or key metrics
 * @param {Object} props - Component properties
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main statistic value to display
 * @param {string} [props.subtitle] - Optional subtitle or description
 * @param {React.ReactNode} [props.icon] - Optional icon component
 * @param {string} [props.color='primary.main'] - Color for the icon and emphasis
 * @param {Object} [props.sx] - Additional MUI sx prop styles
 */
const StatCard = ({ title, value, subtitle, icon, color = 'primary.main', sx = {} }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                color: color,
                backgroundColor: `${color}15`,
                p: 1,
                borderRadius: 2,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard; 