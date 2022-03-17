import PropTypes from 'prop-types'
// material
import { styled } from '@mui/material/styles'
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
} from '@mui/material'
// component
import Iconify from '../../../components/Iconify'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import departmentApi from 'src/apis/department.api'

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}))

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}))

// ----------------------------------------------------------------------

DepartmentListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selectedList: PropTypes.array,
  setSelected: PropTypes.func,
  handleChangeDepartmentList: PropTypes.func,
}

export default function DepartmentListToolbar({
  numSelected,
  filterName,
  onFilterName,
  selectedList,
  setSelected,
  handleChangeDepartmentList,
}) {
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = async () => {
    const isConfirm = window.confirm('Are you sure about that?')
    if (isConfirm) {
      try {
        console.log({ ids: selectedList })
        await departmentApi.delete({ ids: selectedList })
        const res = await departmentApi.getAll()
        setSelected([])
        handleChangeDepartmentList(res)
      } catch (e) {
        if (e.statusCode === 403) {
          enqueueSnackbar('You must be ADMIN to update department', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      }
    }
  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component='div' variant='subtitle1'>
          {numSelected} selected
        </Typography>
      ) : (
        ''
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton onClick={handleDelete}>
            <Iconify icon='eva:trash-2-fill' />
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}
    </RootStyle>
  )
}